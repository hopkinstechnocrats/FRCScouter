use super::data::ServerData;
use std::sync::{Arc, Mutex};
use std::io;
use std::io::Write;

pub fn main(handle: Arc<Mutex<ServerData>>) -> ! {
    println!("FRCScouter v{} READY", env!("CARGO_PKG_VERSION"));
    loop {
        print!("> ");
        io::stdout().flush().unwrap_or_default();
        let mut input = String::new();
        {
            io::stdin().read_line(&mut input).unwrap_or_default();
        }
        match input.trim().as_ref() {
            "help" => {
                println!("Avalable commands:");
                println!("help - this list");
                println!("connected - lists the number of clients connected");
                println!("dump - displays the server's state");
                println!("start - prematurly set the start flag: this starts scouting immediately");
                println!("clear - clears the waiting queue for the next match");
                println!("password - shows the current admin password");
                println!("stop - shuts down the server");
            },
            "connected" => {
                let connected;
                {
                    let data = handle.lock().unwrap();
                    connected = data.clone().amount_connected();
                }
                println!("{} users are connected to the WebSocket server.", connected);
            },
            "dump" => {
                println!("FULL SERVER STATE:\n{:?}", handle.lock().unwrap());
            }
            "password" => {
                let server = handle.lock().unwrap();
                println!("Current admin password | token:\n{}|{}", server.admin_pass, server.token);
                drop(server);
            }
            "clear" => {
                let mut server = handle.lock().unwrap();
                server.robots_scouted = vec![];
                drop(server);
            }
            "stop" => {
                println!("Shutting down...");
                std::process::exit(0);
            },
            "start" => {
                let mut server = handle.lock().unwrap();
                server.start_game_flag = true;
                drop(server);
                println!("Start flag set.");
            },
            /*
            "loadjson" => {
                let mut server = handle.lock().unwrap();
                let mut filepath = std::env::current_dir().unwrap();
                filepath.push("load.json");
                if !filepath.exists() {
                    println!("Unable to load JSON. Problem: \nFile {} does not exist.", filepath.display());
                }
                else {
                    let mut load_file = std::fs::File::open(filepath).unwrap_or_else(|_| {panic!("critical fs error.");});
                    let mut cfg_raw = String::new();
                    use std::io::Read;
                    load_file.read_to_string(&mut cfg_raw).unwrap_or_else(|_| {panic!("critical fs error.");});
                    let json = json::from(cfg_raw);
                    use super::ComputedData;
                    // Vec<(team number, Vec<(match number, Vec<packets>)>)>
                    let fin = ComputedData { data: vec![] };
                    for i in 0..json["teams"].len() {
                        for j in 0..json["teams"][i]["matches"].len() {
                            for k in 0..json["teams"][i]["matches"][j]["packets"].len() {
                                let packet_all = json["teams"][i]["matches"][j]["packets"][k].clone();
                                let packet = packet_all["packet"];
                                let game = packet_all["game"];
                                let team = packet_all["team"];
                                let time = packet_all["time"];
                                let game_fin: usize = from(game);
                            }
                        }
                    }
                    json.l
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
                                tmp_obj5["packet"] = format!("{:?}", k.packet).into();
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
                    
                    println!("Loaded server state from JSON.");
                }
                drop(server);
            },
            */
            _ => {
                println!("Unknown command. Try `help` for a list of commands.");
            }
        }
        std::thread::sleep(std::time::Duration::from_millis(10));
    }
}
