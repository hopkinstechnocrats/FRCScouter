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
            },
            "password" => {
                let server = handle.lock().unwrap();
                println!("Current admin password | token:\n{}|{}", server.admin_pass, server.token);
                drop(server);
            },
            "stop" => {
                println!("Shutting down...");
                std::process::exit(0);
            },
            _ => {
                println!("Unknown command. Try `help` for a list of commands.");
            }
        }
        std::thread::sleep(std::time::Duration::from_millis(10));
    }
}
