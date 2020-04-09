// FRCScouter is not snake case, but we want it that way
#![allow(non_snake_case)]

// Import the static hosting tool
use rocket_contrib::serve::StaticFiles;

use std::thread;
use ws::listen;

fn main() {
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
            println!("Connecting new client to server.");
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
                    // ERROR!
                }
            }
            let mut output = String::new();
            out.send(output)
        }
    }) {
        // Inform the user of failure
        println!("Failed to create WebSocket due to {:?}", error);
    }
}
