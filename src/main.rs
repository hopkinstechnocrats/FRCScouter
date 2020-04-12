// FRCScouter is not snake case, but we want it that way
#![allow(non_snake_case)]

// Import the static hosting tool
use rocket_contrib::serve::StaticFiles;

use std::thread;
use ws::listen;

static NETCODE: &str = "rev.5.0.0";

// Helps file writing/reading
use std::io::prelude::*;

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

    // Create and launch rocket website (see /static), on localhost::[rocket.toml]
    // This is done in a new thread
    let _ = thread::spawn(move || {
        rocket::ignite()
            .mount("/", StaticFiles::from("static"))
            .launch();
    });

    println!("FRCScouter v{} READY", env!("CARGO_PKG_VERSION"));
    // Listen on an address and call the closure for each connection
    if let Err(error) = listen("0.0.0.0:81", |out| {
        // The handler needs to take ownership of out, so we use move
        {
            //println!("Connecting new client to server.");
        }
        move |msg: ws::Message| {
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
                "get-page" => {
                    finaljson["result"] = "get-page".into();
                    match json["page"].as_str().unwrap_or("NOT STR") {
                        "NOT STR" => {
                            println!("WARN: Request for non string page!");
                            finaljson["status"] = "fail".into();
                            finaljson["reason"] = "`page` field was not a String".into();
                        },
                        "homepage" => {
                            finaljson["status"] = "pass".into();
                            finaljson["page_name"] = json["page"].clone();
                            finaljson["page_material"] = json::parse(
                                &String::from_utf8(
                                    include_bytes!("pages/homepage.json").to_vec()
                                ).unwrap()
                            ).unwrap();
                        },
                        _ => {
                            println!("WARN: Request for unkown page! {:?}", json["page"]);
                            finaljson["status"] = "fail".into();
                            finaljson["reason"] = "Unkown page".into();
                        }
                    }
                },
                _ => {
                    println!("WARN: Received unknown request! {:?}", json["request"]);
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
