// FRCScouter is not snake case, but we want it that way
#![allow(non_snake_case)]

use std::thread;

static NETCODE: &str = "rev.5.0.0";

static INDEX: &str = include_str!("index.html");
static INDEXADMIN: &str = include_str!("admin.html");

fn main() {
    // Create and launch website thread on localhost::80. Single threaded is fine because this is
    // just to show the index.html and not heavily used
    let _ = thread::spawn(move || {
        use std::net::TcpListener;
        use std::io::prelude::*;
        let listener = TcpListener::bind("0.0.0.0:80").unwrap_or_else(|_| {
            println!("A critical error occured at startup: unable to bind to local TCP socket *:80");
            println!("Please check that no other process is running on that port and that your firewall is allowing this program.");
            std::process::exit(0);
        });
        for stream in listener.incoming() {
            match stream {
                Ok(mut stream) => {
                    let mut buffer = [0; 512];
                    stream.read(&mut buffer).unwrap_or_else(|_| {
                        println!("Unable to read a client's datastream. This can probably be ignored.");
                        return 0;
                    });
        
                    let buffer = String::from_utf8(buffer.to_vec()).unwrap_or_else(|_| {
                        println!("Unable to decode a client's data to utf8. This can probably be ignored.");
                        return String::new();
                    });
        
                    if !buffer.contains("favicon") && !buffer.contains("admin") {
                        stream.write(&format!("HTTP/1.1 200 OK\r\n\r\n{}", INDEX).as_bytes()).unwrap();
                        stream.flush().unwrap();
                    }
                    else if buffer.contains("admin") {
                        stream.write(&format!("HTTP/1.1 200 OK\r\n\r\n{}", INDEXADMIN).as_bytes()).unwrap();
                        stream.flush().unwrap();
                    }
                    else {
                        stream.write("HTTP/1.1 404 NOT FOUND\r\n\r\n".as_bytes()).unwrap();
                        stream.flush().unwrap();
                    }
                }
                Err(_) => {
                    println!("An error occured getting a stream to a client. This can probably be ignored.");
                }
            }

            
        }
    });

    let plugins = load_plugins();

    println!("FRCScouter v{} READY", env!("CARGO_PKG_VERSION"));
    println!("{} plugins loaded", plugins.len());

    use ws::listen;
    // Listen on an address and call the closure for each connection
    if let Err(error) = listen("0.0.0.0:81", |out| {
        
        // The handler needs to take ownership of out, so we use move
        {
            //println!("Connecting new client to server.");
        }
        let tmomm = plugins.clone();
        move |msg: ws::Message| {
            let pluginlisttmp = tmomm.clone();
            let input = &msg.clone().into_text().unwrap_or_else(|_| {
                // warn that bytes were passed instead of a string, but don't crash.
                println!("WS SERVER UNABLE TO UNWRAP MESSAGE");
                return String::from("{\"result\": \"wrong-format\"}");
            });
            let alt = json::parse("{\"result\":\"not-json\"}").unwrap();
            let json = json::parse(input).unwrap_or(alt);
            if json["result"].is_string() {
                if json["result"] == "not-json" || json["result"] == "wrong-format" {
                    return out.send(json::stringify(json));
                }
                else {
                    return out.send("{\"result\":\"broken-key\"}");
                }
            }
            let mut finaljson = json::parse("{}").unwrap();
            match json["request"].as_str().unwrap_or("NOT STR") {
                "NOT STR" => {
                    println!("WARN: Received non string data! {:?}", json["request"]);
                },
                "version" => {
                    finaljson["result"] = "version".into();
                    finaljson["version"] = NETCODE.into();
                },
                "plugins" => {
                    finaljson["result"] = "plugins".into();
                    finaljson["plugins"] = json::JsonValue::new_array();
                    for i in pluginlisttmp {
                        let strom = json::parse(&format!("\"{}\"", i.clone().0.clone())).unwrap();
                        finaljson["plugins"].push(strom).unwrap();
                    }
                },
                "plugin-data" => {
                    let tostr = json["plugin"].as_str().unwrap_or("NOT STR");
                    if tostr == "NOT STR" {
                        println!("WARN: plugin-data requested a plugin that was NOT a String.");
                        finaljson["result"] = "broken-key".into();
                        return out.send(json::stringify(finaljson));
                    }
                    for i in pluginlisttmp {
                        if tostr == i.clone().0 {
                            // send out the data
                            finaljson["result"] = "plugin-data".into();
                            finaljson["plugin"] = json["plugin"].clone();
                            finaljson["pages"] = json::JsonValue::new_array();
                            for material in i.1 {
                                let mut tmp_obj = json::JsonValue::new_object();
                                tmp_obj["data"] = material.1.clone().into();
                                tmp_obj["name"] = material.0.clone().into();
                                finaljson["pages"].push(tmp_obj).unwrap();
                            }
                            return out.send(json::stringify(finaljson));
                        }
                    }
                    println!("WARN: unkown plugin's data requested: {}", tostr);
                    finaljson["result"] = "TEMPORARY-ERROR".into();
                    return out.send(json::stringify(finaljson));
                }
                _ => {
                    println!("WARN: Received unknown request! {:?}", json["request"]);
                    println!("Full request: {:?}", json);
                    finaljson["result"] = "broken-key".into();
                }
            }
            return out.send(json::stringify(finaljson));
        }
    }) {
        // Inform the user of failure
        println!("Failed to create WebSocket due to {:?}", error);
    }
}

fn load_plugins() -> Vec<(String, Vec<(String, String)>)> {
    let mut plugs = vec![];
    let mut tmp_dir = std::env::current_dir().unwrap();
    tmp_dir.push("plugins");
    if !tmp_dir.exists() {
        std::fs::create_dir(tmp_dir.clone()).unwrap();
    }
    let files = std::fs::read_dir(tmp_dir).unwrap();
    for file in files {
        let realfile = file.unwrap().path();
        if !realfile.is_dir() {
            panic!("PLUGIN ERROR: {:?} is not a directory!", realfile.display());
        }
        plugs.push((String::from(realfile.clone().file_name().unwrap().to_str().unwrap()), vec![]));
        // represents the plugin being read
        let plugin = std::fs::read_dir(realfile.clone()).unwrap();
        for component_maybe in plugin {
            let component = component_maybe.unwrap();
            let filename = String::from(component.path().clone().file_name().unwrap().to_str().unwrap());
            let data = std::fs::read_to_string(component.path()).unwrap();
            let tmp_len = plugs.len();
            plugs[tmp_len - 1].1.push((filename, data));
        }
    }
    return plugs;
}
