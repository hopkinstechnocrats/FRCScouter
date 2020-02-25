mod ping;
pub mod data;
mod network;
mod console;

use ws::listen;

use network::packet::Packet;

use data::WrappedPacket;

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
                // Process and respond to the packet
                match packet {
                    Packet::PongClient(a, b) => {
                        let mut server = server.lock().unwrap();
                        server.packets.pings.push(WrappedPacket::new_from_packet(Packet::PongClient(a, b)));
                    }
                    // User requested an id
                    Packet::PingUSID() => {
                        let mut server = server.lock().unwrap();
                        // get the next id and send it to the user
                        payload.push(Packet::PongUSID(server.get_next_usid()));
                    },
                    Packet::G2020LeaveQueue(usid) => {
                        let mut server = server.lock().unwrap();
                        let mut changed = true;
                        while changed {
                            changed = false;
                            for i in 0..server.robots_scouted.len() {
                                if server.robots_scouted[i].0 == usid {
                                    server.robots_scouted.remove(i);
                                    changed = true;
                                }
                            }
                        }
                        drop(server);
                    }
                    // User selected a robot to scout
                    Packet::G2020RobotSelected(usid, robot) => {
                        let mut server = server.lock().unwrap();
                        // Save that info
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
                        // Send user the robots that are being scouted
                        payload.push(Packet::G2020ScoutersWaiting(server.robots_scouted.len(), fin));
                        drop(server);
                    },
                    Packet::G2020RequestWaiting() => {
                        let mut server = server.lock().unwrap();
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
                    },
                    Packet::G2020RequestRunningGameID() => {
                        let server = server.lock().unwrap();
                        let id = server.game;
                        drop(server);
                        payload.push(Packet::G2020RunningGameID(id));
                    }
                    Packet::PingServer(usid) => {
                        payload.push(Packet::PongServer(usid));
                    },
                    Packet::G2020PreloadedCells(_) | Packet::G2020AutoShot(_, _, _) |
                    Packet::G2020AutoLine(_) | Packet::G2020TeleShot(_, _, _) |
                    Packet::G2020PositionControl() | Packet::G2020RotationControl() |
                    Packet::G2020AttemptedClimb(_, _, _) |
                    Packet::G2020EndGameQuestions(_, _, _, _, _, _, _) => {
                        let mut server = server.lock().unwrap();
                        let game = server.game;
                        server.packets.game.push(WrappedPacket::new_with_game(packet, game));
                        drop(server);
                    }
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
