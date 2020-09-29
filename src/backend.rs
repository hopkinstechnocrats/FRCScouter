use ws::listen;

use std::sync::{Arc, Mutex};
use std::thread;

use crate::data::ServerData;

/// Launches the WebSocket server. This communicates with clients and processes their data.
pub fn launch() {
    // The server's state and data is stored as an Arc<Mutex<T>> so that we can share it across
    // threads for use in multiple places at once.
    let server = Arc::new(
        Mutex::new(
            ServerData::new()
        )
    );

    // Listen on an address and call the closure for each connection
    if let Err(error) = listen("0.0.0.0:81", |out| {
        // Someone has connected! Let us deal with the data and such
        // The handler needs to take ownership of out, so we use move
        move |msg: ws::Message| {
            // If we can't get the message sent to us as text,
            match &msg.clone().into_text() {
                Err(_) => {
                    // Warn that bytes were passed instead of a string, but don't crash.
                    println!("Warning: A message was sent to the WebSocket server as binary instead of text.");
                    return out.send("{\"result\": \"wrong-format\"}");
                },
                Ok(input) => {
                    match json::parse(input) {
                        Err(_) => {
                            // The data sent wasn't valid JSON. Warn but don't crash.
                            println!("Warning: A message was sent to the WebSocket server consisting of invalid JSON.");
                            return out.send("{\"result\": \"not-json\"}");
                        }
                        Ok(data) => {
                            if let Some(response) = data["type"].as_str() {
                                match response {
                                    "GetUSID" => {
                                        // not done
                                    },
                                    _ => {
                                        println!("Warning: A message was sent to the WebSocket server with an unknown type label.");
                                        return out.send("{\"result\": \"unknown-request\"}");
                                    }
                                }
                            }
                            else {
                                println!("Warning: A message was sent to the WebSocket server without an approprite type label.");
                                return out.send("{\"result\": \"no-request\"}");
                            }
                        }
                    }
                }
            }
            
            // We weren't able to process your request, sorry!
            out.send("{\"result\": \"no-response\"}")
        }
    }) {
        // A websocket connection failed, ignore completely.
    }
}
