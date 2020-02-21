mod ping;
pub mod data;
mod network;
mod console;

use ws::listen;

use network::packet::Packet;

use std::sync::{Arc, Mutex};
use std::thread;

/// Launches the WebSocket server. This communicates with clients and processes their data.
/// Pretty much the core of this project.
pub fn launch_websocket() {
    println!("WebSocket server launching threads");
    // Server's local state inside of a bunch of stack and shared mut wrappers
    let server = Arc::new(
        Mutex::new(
            data::ServerData::new()
        )
    );

    // ping pong thread
    let tmp_handle = Arc::clone(&server);
    thread::spawn(move || {
        println!("Spawned thread for pings");
        ping::start_ping_threads(tmp_handle);
    });

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
            let packets = Packet::get_packets_from_raw(&msg.clone().into_text().unwrap_or_else(|_| {panic!("WS SERVER UNABLE TO UNWRAP MESSAGE")}));
            
            let mut payload: Vec<Packet> = vec![];

            // For each packet we have, handle it properly
            for packet in packets {
                // If this packet can be stored then we should do that
                let maybe_chunk = data::Chunk::new(packet.clone());
                if maybe_chunk.is_some() {
                    let mut server = server.lock().unwrap();
                    server.add_data(maybe_chunk.unwrap());
                    // Make sure we drop this handle to not block threads
                    drop(server);
                }
                // If we need to do any immediate proccessing or response, that's here
                match packet {
                    Packet::PingUSID() => {
                        let mut server = server.lock().unwrap();
                        payload.push(Packet::PongUSID(server.get_next_usid()));
                    },
                    Packet::G2020RobotSelected(usid, robot) => {
                        let mut server = server.lock().unwrap();
                        server.robots_scouted.push((usid, robot));
                        let mut fin: Vec<(usize, usize)> = vec![];
                        for i in server.robots_scouted.clone() {
                            let mut matched = false;
                            for j in 0..fin.len() {
                                if i.1 == fin[j].0 {
                                    fin[j].1 += 1;
                                    matched = true;
                                }
                            }
                            if !matched {
                                fin.push((i.1, 1));
                            }
                        }
                        if fin.len() == 6 {
                            server.start_game_flag = true;
                        }
                        payload.push(Packet::G2020ScoutersWaiting(server.robots_scouted.len(), fin));
                        drop(server);
                    }
                    Packet::PingServer(usid) => {
                        payload.push(Packet::PongServer(usid));
                    },
                    _ => {}
                }
            }
            // Use the out channel to send messages back
            let finaloutput = network::encode::stream_to_raw(network::Stream::new_with_packets(payload));
            // println!("server response: `{}`", finaloutput);
            out.send(finaloutput)
        }
    }) {
        // Inform the user of failure
        println!("Failed to create WebSocket due to {:?}", error);
    }
}
