// FRCScouter is not snake case, but we want it that way
#![allow(non_snake_case)]

use std::thread;

static NETCODE: &str = "rev.5.0.0";

// plugin loading
pub mod plugins;

static INDEX: &str = include_str!("index.html");

fn main() {
    // Create and launch website thread on localhost::80. Single threaded is fine because this is
    // just to show the index.html and not heavily used
    let _ = thread::spawn(move || {
        use std::net::TcpListener;
        use std::io::prelude::*;
        let listener = TcpListener::bind("0.0.0.0:80").unwrap();
        for stream in listener.incoming() {
            let mut stream = stream.unwrap();

            let mut buffer = [0; 512];
            stream.read(&mut buffer).unwrap();

            let buffer = String::from_utf8(buffer.to_vec()).unwrap();

            if !buffer.contains("favicon") {
                stream.write(&format!("HTTP/1.1 200 OK\r\n\r\n{}", INDEX).as_bytes()).unwrap();
                stream.flush().unwrap();
            }
            else {
                stream.write("HTTP/1.1 404 NOT FOUND\r\n\r\n".as_bytes()).unwrap();
                stream.flush().unwrap();
            }
        }
    });

    // load plugins
    let mut tmp_dir = std::env::current_dir().unwrap();
    tmp_dir.push("plugins");
    if !tmp_dir.exists() {
        std::fs::create_dir(tmp_dir.clone()).unwrap();
    }
    let files = std::fs::read_dir(tmp_dir).unwrap();
    let mut pluginlist: Vec<plugins::Plugin> = vec![];
    for file in files {
        let realfile = file.unwrap().path();
        if !realfile.is_dir() {
            panic!("PLUGIN ERROR: {:?} is not a directory!", realfile.display());
        }
        // represents the plugin being read
        let mut thisplugin = plugins::PluginConstructor::construct();
        let plugin = std::fs::read_dir(realfile.clone()).unwrap();
        for component_maybe in plugin {
            let component = component_maybe.unwrap();
            if component.path().file_name().unwrap().to_str().unwrap() == "config.json" {
                let data = std::fs::read_to_string(component.path()).unwrap();
                let json = json::parse(&data).unwrap();
                thisplugin.with_name(json["name"].as_str().unwrap_or("NONAME").to_string());
                thisplugin.with_version(json["version"].as_str().unwrap_or("NOVERSION").to_string());
                let mut hooks = json["hooks"].clone();
                if hooks.is_empty() || hooks.is_null() {
                    // do nothing, no hooks.
                }
                else if !hooks.is_array() {
                    println!("WARNING: plugin {} has a hooks field that is NOT an Array", thisplugin.clone().build().get_name());
                }
                else {
                    loop {
                        let element = hooks.pop();
                        if element.is_null() {
                            break;
                        }
                        else if !element.is_object() {
                            println!("WARNING: plugin {} has a hook that is NOT an Object", thisplugin.clone().build().get_name());
                            break;
                        }
                        else { 
                            let hooktype = element["type"].as_str();
                            let hookname = element["name"].as_str();
                            if hooktype.is_none() {
                                panic!("PLUGIN ERROR: plugin {} has a hook that does not have a proper type field", thisplugin.clone().build().get_name());
                            }
                            if hookname.is_none() {
                                panic!("PLUGIN ERROR: plugin {} has a hook that does not have a proper name field", thisplugin.clone().build().get_name());
                            }
                            let hooktype = hooktype.unwrap();
                            let hookname = hookname.unwrap();
                            thisplugin.with_hook(String::from(hooktype), String::from(hookname));
                        }
                    }
                }
            }
            else {
                let data = std::fs::read_to_string(component.path()).unwrap();
                thisplugin.with_file(String::from(component.path().file_name().unwrap().to_str().unwrap()), data);
            }
        }
        // add the plugin to the list
        pluginlist.push(thisplugin.build());
    }

    println!("FRCScouter v{} READY", env!("CARGO_PKG_VERSION"));
    println!("{} plugins loaded", pluginlist.len());

    use ws::listen;
    // Listen on an address and call the closure for each connection
    if let Err(error) = listen("0.0.0.0:81", |out| {
        
        // The handler needs to take ownership of out, so we use move
        {
            //println!("Connecting new client to server.");
        }
        let tmomm = pluginlist.clone();
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
                        finaljson["plugins"].push(json::parse(&format!("{{\"name\":\"{}\",\"version\":\"{}\"}}", i.clone().get_name(), i.get_version())).unwrap()).unwrap();
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
                        if tostr == i.clone().get_name() {
                            // send out the data
                            finaljson["result"] = "plugin-data".into();
                            finaljson["plugin"] = json["plugin"].clone();
                            finaljson["map"] = json::JsonValue::new_array();
                            for (triggertype, filename) in i.clone().get_hooks() {
                                let mut tmp_obj = json::JsonValue::new_object();
                                tmp_obj["trigger"] = triggertype.to_string().into();
                                tmp_obj["name"] = filename.clone().into();
                                let files = i.clone().get_files();
                                let mut foundfile = false;
                                for (filetitle, filecontents) in files {
                                    if filetitle == format!("{}.json", filename) {
                                        foundfile = true;
                                        tmp_obj["content"] = filecontents.into();
                                        finaljson["map"].push(tmp_obj).unwrap();
                                        break;
                                    }
                                }
                                if !foundfile {
                                    panic!("A plugin had a refrence to a file that does not exist.");
                                }
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
