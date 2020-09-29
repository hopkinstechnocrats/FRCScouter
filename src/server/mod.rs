pub mod data;
mod network;
mod console;

use ws::listen;

use network::packet::Packet;

use data::WrappedPacket;

use std::sync::{Arc, Mutex};
use std::thread;

use chrono::offset::Utc;
use chrono::DateTime;
use data::ServerData;

/// Launches the WebSocket server. This communicates with clients and processes their data.
/// Pretty much the core of this project.
pub fn launch_websocket() {
    println!("WebSocket server launching threads");
    // Server's local state inside of a bunch of stack and shared mut wrappers
    let server = Arc::new(
        Mutex::new(
            ServerData::new()
        )
    );

    // UI / console thread
    let tmp_handle = Arc::clone(&server);
    thread::spawn(move || {
        println!("Spawned thread for console");
        console::main(tmp_handle);
    });

    // Listen on an address and call the closure for each connection
    if let Err(error) = listen("0.0.0.0:81", |out| {
        // The handler needs to take ownership of out, so we use move
        let server = Arc::clone(&server);
        {
            let mut server = server.lock().unwrap();
            server.new_connection(out.clone());
            println!("Connecting new client to server.");
            drop(server);
        }
        move |msg: ws::Message| {

            // Handle messages received on this connection
            // println!("WebSocket server recived data: `{}`", msg);
            let input = &msg.clone().into_text().unwrap_or_else(|_| {
                // warn that bytes were passed instead of a string, but don't crash.
                println!("Warning: A message was sent to the WebSocket server as binary instead of text.");
                return String::from("{\"result\": \"wrong-format\"}");
            });
            let alt = json::parse("{\"result\":\"not-json\"}").unwrap();
            let json = json::parse(input).unwrap_or(alt);
            if let Some(response) = json["type"].as_str() {
                match response {
                    "GetUSID" => {
                        // not done
                    },
                    _ => {
                        println!("Warning: A message was sent to the WebSocket server with an unknown type label.");
                    }
                }
            }
            else {
                println!("Warning: A message was sent to the WebSocket server without an approprite type label.");
            }
            // Use the out channel to send messages back
            // out.send(data)
            out.send("{\"result\": \"no-response\"}")
        }
    }) {
        // Inform the user of failure
        println!("Failed to create WebSocket due to {:?}", error);
    }
}

fn compute_game_data(indata: Vec<WrappedPacket>) -> ComputedData {
    // team, match, packets
    let mut team_pack: Vec<(usize, Vec<(usize, Vec<WrappedPacket>)>)> = vec![];
    for i in indata {
        let mut found_team = false;
        let mut found_match = false;
        let mut index1 = 0;
        for j in team_pack.clone() {
            if i.team.unwrap() == j.0 {
                found_team = true;
                let mut index2 = 0;
                for k in team_pack[index1].1.clone() {
                    if i.game.unwrap() == k.0 {
                        team_pack[index1].1[index2].1.push(i.clone());
                        found_match = true;
                        break;
                    }
                    index2 += 1;
                }
                break;
            }
            index1 += 1;
        }
        if !found_team {
            team_pack.push((i.team.unwrap(), vec![(i.game.unwrap(), vec![i.clone()])]));
        }
        else if !found_match {
            team_pack[index1].1.push((i.game.unwrap(), vec![i.clone()]));
        }
    }
    return ComputedData { data: team_pack };
}

#[derive(Debug)]
pub struct ComputedData {
    // Vec<(team number, Vec<(match number, Vec<packets>)>)> 
    pub data: Vec<(usize, Vec<(usize, Vec<WrappedPacket>)>)>
}
