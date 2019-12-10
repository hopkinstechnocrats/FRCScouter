mod packet;
mod stream;

use ws::listen;

use packet::Packet;

use crate::server::stream::roboconnect::*;

#[derive(Clone, Eq, PartialEq, Copy)]
struct ServerData {
    usid: usize
}

impl ServerData {
    pub fn new() -> ServerData {
        ServerData {
            usid: 0,
        }
    }
    pub fn get_next_usid(&mut self) -> usize {
        self.usid += 1;
        return self.usid;
    }
}

use std::sync::{Arc, Mutex};

/// Launches the WebSocket server
pub fn launch_websocket() {
    println!("websocket launched");
    // Listen on an address and call the closure for each connection
    let server = Arc::new(
        Mutex::new(
            ServerData::new()
        )
    );
    if let Err(error) = listen("127.0.0.1:4001", |out| {
        println!("A connection was established with the WS server.");
        // The handler needs to take ownership of out, so we use move
        let server = Arc::clone(&server);
        move |msg: ws::Message| {

            // Handle messages received on this connection
            println!("SERVER INPUT  `{}`", msg);
            let packets = Packet::get_packets_from_raw(&msg.clone().into_text().unwrap_or_else(|_| {panic!("WS SERVER UNABLE TO UNWRAP MESSAGE")}));
            
            let mut payload: Vec<Packet> = vec![];
            for packet in packets {
                match packet {
                    Packet::PingUSID() => {
                        let mut server = server.lock().unwrap();
                        payload.push(Packet::PongUSID(server.get_next_usid()));
                    }
                    _ => {
                        panic!("An unhandled packet was recived!");
                    }
                }
            }
            // Use the out channel to send messages back
            let finaloutput = stream::encode::stream_to_raw(stream::Stream::new_with_packets(payload));
            println!("SERVER OUTPUT `{}`", finaloutput);
            out.send(finaloutput)
        }
    }) {
        // Inform the user of failure
        println!("Failed to create WebSocket due to {:?}", error);
    }
}

pub fn launch_robot() {
    println!("robot connection launched");
    let result = attempt_connection();
}
