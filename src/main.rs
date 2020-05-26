// FRCScouter is not snake case, but we want it that way
#![allow(non_snake_case)]

// Import the static hosting tool
use rocket_contrib::serve::StaticFiles;

use std::thread;
use ws::listen;

static NETCODE: &str = "rev.5.0.0";

// Helps file writing/reading
use std::io::prelude::*;

// plugin loading
pub mod plugins;

use include_dir::{include_dir, Dir};

fn main() {
    // If a Rocket.toml is not present, create one.
    let rockettoml = include_bytes!("Rocket.toml");
    let mut tmp_dir = std::env::current_dir().unwrap();
    tmp_dir.push("Rocket.toml");
    if !tmp_dir.exists() {
        let mut tmp_file = std::fs::File::create(tmp_dir).unwrap();
        tmp_file.write_all(rockettoml).unwrap();
    }
    drop(rockettoml);

    // If the static folder is not present, create it.
    //let staticfolder = include_dir!("./static");
    //let mut tmp_dir = std::env::current_dir().unwrap();
    //for i in staticfolder.
    //std::fs::File::create(staticfolder);

    // Create and launch rocket website (see /static), on localhost::[rocket.toml]
    // This is done in a new thread
    let _ = thread::spawn(move || {
        rocket::ignite()
            .mount("/", StaticFiles::from("static"))
            .launch();
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
                    println!("WARNING: A plugin has a hooks field that is NOT an Array");
                }
                else {
                    loop {
                        let element = hooks.pop();
                        if element.is_null() {
                            break;
                        }
                        else if !element.is_object() {
                            println!("WARNING: A plugin has a hook that is NOT an Object");
                            break;
                        }
                        else { 
                            let hooktype = element["type"].as_str();
                            let hookname = element["name"].as_str();
                            if hooktype.is_none() {
                                panic!("PLUGIN ERROR: A plugin has a hook that does not have a proper type field");
                            }
                            if hookname.is_none() {
                                panic!("PLUGIN ERROR: A plugin has a hook that does not have a proper name field");
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
