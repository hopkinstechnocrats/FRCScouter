use ws::listen;

use std::sync::{Arc, Mutex};
use std::thread;

use crate::data::*;

/// Launches the WebSocket server. This communicates with clients and processes their data.
pub fn launch() {
    // The server's state and data is stored as an Arc<Mutex<T>> so that we can share it across
    // threads for use in multiple places at once.
    let server = Arc::new(
        Mutex::new(
            Data::new()
        )
    );

    // Listen on an address and call the closure for each connection
    if let Err(error) = listen("0.0.0.0:81", |out| {
        // prepare the server to be moved into thread if needed
        let server = Arc::clone(&server);

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
                                    "attempted-shot" => {
                                        let shot_location: ShotLocation;
                                        let bin_location: BinLocation;
                                        let shot_succeded: Succeeded;
                                        if let Some(sl) = data["shot-location"].as_str() {
                                            if let Some(slc) = ShotLocation::from_str(sl) {
                                                shot_location = slc;
                                            }
                                            else {
                                                return out.send("{\"result\": \"malformed\"}");
                                            }
                                        }
                                        else {
                                            return out.send("{\"result\": \"malformed\"}");
                                        }
                                        if let Some(bl) = data["bin-location"].as_str() {
                                            if let Some(blc) = BinLocation::from_str(bl) {
                                                bin_location = blc
                                            }
                                            else {
                                                return out.send("{\"result\": \"malformed\"}");
                                            }
                                        }
                                        else {
                                            return out.send("{\"result\": \"malformed\"}");
                                        }
                                        if let Some(ss) = data["shot-succeeded"].as_str() {
                                            if let Some(ssc) = Succeeded::from_str(ss) {
                                                shot_succeded = ssc;
                                            }
                                            else {
                                                return out.send("{\"result\": \"malformed\"}");
                                            }
                                        }
                                        else {
                                            return out.send("{\"result\": \"malformed\"}");
                                        }
                                        let mut server = server.lock().unwrap();
                                        server.attempted_shot(shot_location, bin_location, shot_succeded);
                                        drop(server);
                                        return out.send("{\"result\": \"ok\"}");
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
