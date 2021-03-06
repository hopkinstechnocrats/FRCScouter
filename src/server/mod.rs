mod ping;
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
                        drop(server);
                    },
                    // User requested an id
                    Packet::PingUSID() => {
                        let mut server = server.lock().unwrap();
                        // get the next id and send it to the user
                        payload.push(Packet::PongUSID(server.get_next_usid()));
                    },
                    Packet::PingServer(usid) => {
                        payload.push(Packet::PongServer(usid));
                    },
                    Packet::G2020PreloadedCells(a, b, _) | Packet::G2020AutoShot(a, b, _, _, _) |
                    Packet::G2020AutoLine(a, b, _) | Packet::G2020TeleShot(a, b, _, _, _) |
                    Packet::G2020PositionControl(a, b) | Packet::G2020RotationControl(a, b) |
                    Packet::G2020AttemptedClimb(a, b, _, _, _) |
                    Packet::G2020EndGameQuestions(a, b, _, _, _, _, _, _, _) => {
                        let mut server = server.lock().unwrap();
                        server.packets.game.push(WrappedPacket::new_with_team(packet, b, a));
                        drop(server);
                    },
                    Packet::G2020RequestData(_, _) => {
                        // quickly grap packets of server and drop
                        let server = server.lock().unwrap();
                        let game_data = server.packets.game.clone();
                        drop(server);
                        // compute
                        let game_data_done = compute_game_data(game_data);
                        // convert to json
                        let mut root = json::JsonValue::new_object();
                        let mut team_sub = json::JsonValue::new_array();
                        for i in game_data_done.data {
                            let mut tmp_obj = json::JsonValue::new_object();
                            let mut tmp_obj2 = json::JsonValue::new_array();
                            // Vec<(usize, Vec<WrappedPacket>)>
                            for j in i.1 {
                                let mut tmp_obj3 = json::JsonValue::new_object();
                                let mut tmp_obj4 = json::JsonValue::new_array();
                                for k in j.1 {
                                    let mut tmp_obj5 = json::JsonValue::new_object();
                                    match k.packet {
                                        Packet::G2020PreloadedCells(_, _, cells) => {
                                            let mut tmp_obj6 = json::JsonValue::new_object(); 
                                            tmp_obj6["type"] = "PreloadedCells".into();
                                            tmp_obj6["amount"] = cells.into();
                                            tmp_obj5["packet"] = tmp_obj6;
                                        },
                                        Packet::G2020AutoShot(_, _, high, missed, position) => {
                                            let mut tmp_obj6 = json::JsonValue::new_object(); 
                                            tmp_obj6["type"] = "AutoShot".into();
                                            tmp_obj6["high"] = high.into();
                                            tmp_obj6["missed"] = missed.into();
                                            tmp_obj6["position"] = position.into();
                                            tmp_obj5["packet"] = tmp_obj6;
                                        },
                                        Packet::G2020AutoLine(_, _, state) => {
                                            let mut tmp_obj6 = json::JsonValue::new_object();
                                            tmp_obj6["type"] = "AutoLine".into();
                                            tmp_obj6["amount"] = state.into();
                                            tmp_obj5["packet"] = tmp_obj6;
                                        },
                                        Packet::G2020TeleShot(_, _, high, missed, position) => {
                                            let mut tmp_obj6 = json::JsonValue::new_object(); 
                                            tmp_obj6["type"] = "TeleShot".into();
                                            tmp_obj6["high"] = high.into();
                                            tmp_obj6["missed"] = missed.into();
                                            tmp_obj6["position"] = position.into();
                                            tmp_obj5["packet"] = tmp_obj6;
                                        },
                                        Packet::G2020PositionControl(_, _) => {
                                            let mut tmp_obj6 = json::JsonValue::new_object();
                                            tmp_obj6["type"] = "PositionControl".into();
                                            tmp_obj5["packet"] = tmp_obj6;
                                        },
                                        Packet::G2020RotationControl(_, _) => {
                                            let mut tmp_obj6 = json::JsonValue::new_object();
                                            tmp_obj6["type"] = "RotationControl".into();
                                            tmp_obj5["packet"] = tmp_obj6;
                                        },
                                        Packet::G2020AttemptedClimb(_, _, repo, bal, succ) => {
                                            let mut tmp_obj6 = json::JsonValue::new_object();
                                            tmp_obj6["type"] = "AttemptedClimb".into();
                                            tmp_obj6["repositioned"] = repo.into();
                                            tmp_obj6["balenced"] = bal.into();
                                            tmp_obj6["completed"] = succ.into();
                                            tmp_obj5["packet"] = tmp_obj6;
                                        },
                                        Packet::G2020EndGameQuestions(_, _, ctrl, foul, can_def, was_def, was_red, can_def_prof, was_def_prof) => {
                                            let mut tmp_obj6 = json::JsonValue::new_object();
                                            tmp_obj6["type"] = "EndQuestions".into();
                                            tmp_obj6["did_control"] = ctrl.into();
                                            tmp_obj6["did_foul"] = foul.into();
                                            tmp_obj6["can_defend"] = can_def.into();
                                            tmp_obj6["was_defended"] = was_def.into();
                                            tmp_obj6["was_red"] = was_red.into();
                                            tmp_obj6["defending_ablitiy"] = can_def_prof.into();
                                            tmp_obj6["defended_ability"] = was_def_prof.into();
                                            tmp_obj5["packet"] = tmp_obj6;
                                        },
                                        _ => {
                                            tmp_obj5["packet"] = "INVALID".into();
                                        }
                                    }
                                    //tmp_obj5["packet"] = format!("{}", packetres).into();
                                    tmp_obj5["game"] = k.game.unwrap().into();
                                    tmp_obj5["team"] = k.team.unwrap().into();
                                    let chronotmp: DateTime<Utc> = k.time.into();
                                    tmp_obj5["time"] = format!("{}", chronotmp.format("%T")).into();
                                    tmp_obj4.push(tmp_obj5).unwrap();
                                }
                                tmp_obj3["match_number"] = j.0.into();
                                tmp_obj3["packets"] = tmp_obj4.into();
                                tmp_obj2.push(tmp_obj3).unwrap();
                            }
                            tmp_obj["team_number"] = i.0.into();
                            tmp_obj["matches"] = tmp_obj2.into();
                            team_sub.push(tmp_obj).unwrap();
                        }
                        root["teams"] = team_sub.into();
                        let finaldata = json::stringify_pretty(root, 4);
                        // send it off
                        payload.push(Packet::G2020ReturnData(finaldata.chars().count(), finaldata))
                    },
                    Packet::ARequestAccess(pass) => {
                        let mut server = server.lock().unwrap();
                        let serv_pass = server.admin_pass;
                        if serv_pass == pass {
                            payload.push(Packet::AGrantAccess(server.gen_token()));
                        }
                        else {
                            payload.push(Packet::ADenyAccess());
                        }
                        drop(server);
                    },
                    Packet::ACommand(token, command, data) => {
                        let mut server = server.lock().unwrap();
                        if server.token != token {
                            println!("INVALID ADMIN TOKEN!");
                            payload.push(Packet::ADenyAccess());
                        }
                        else {
                            match command {
                                1 => {
                                    server.packets = data::PacketList::new();
                                    println!("Mass server data reset by admin.");
                                },
                                2 => {
                                    server.admin_pass = data;
                                    println!("Password set to {} by admin.", data);
                                },
                                3 => {
                                    let mut index = 0;
                                    let mut removals = 0;
                                    for i in server.packets.game.clone() {
                                        if i.team == Some(data) {
                                            server.packets.game.remove(index - removals);
                                            removals += 1;
                                        }
                                        index += 1;
                                    }
                                    println!("Team {}'s data reset by admin.", data);
                                },
                                4 => {
                                    let mut index = 0;
                                    let mut removals = 0;
                                    for i in server.packets.game.clone() {
                                        if i.game == Some(data) {
                                            server.packets.game.remove(index - removals);
                                            removals += 1;
                                        }
                                        index += 1;
                                    }
                                    println!("Match {}'s data reset by admin.", data);
                                },
                                a => {println!("Unknown admin command `{}`", a)}
                            }
                        }
                        drop(server);
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
