mod packet;
mod stream;
pub mod data;

use ws::listen;

use packet::Packet;

use crate::server::stream::roboconnect::*;

#[derive(Clone, Eq, PartialEq, Debug)]
/// The WebSocket server's state is stored as a ServerData
struct ServerData {
    usid: usize,
    unchecked_data: Vec<data::Chunk>
}

impl ServerData {
    /// Creates a new ServerData
    pub fn new() -> ServerData {
        ServerData {
            usid: 0,
            unchecked_data: vec![]
        }
    }
    /// Gets a unique USID (User Session IDentification) and increments
    /// the interal USID counter
    pub fn get_next_usid(&mut self) -> usize {
        self.usid += 1;
        return self.usid;
    }
    /// Adds unchecked data to the local state
    pub fn add_data(&mut self, chunk: data::Chunk) {
        self.unchecked_data.push(chunk);
    }
}

use std::sync::{Arc, Mutex};

/// Launches the WebSocket server
pub fn launch_websocket() {
    println!("WebSocket server launching");
    // Server's local state inside of a bunch of stack and shared mut wrappers
    let server = Arc::new(
        Mutex::new(
            ServerData::new()
        )
    );
    // Listen on an address and call the closure for each connection
    if let Err(error) = listen("127.0.0.1:81", |out| {
        println!("A connection was established with the WS server.");
        // The handler needs to take ownership of out, so we use move
        let server = Arc::clone(&server);
        move |msg: ws::Message| {

            // Handle messages received on this connection
            println!("WebSocket server recived data: `{}`", msg);
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
                    Packet::PingServer(usid) => {
                        payload.push(Packet::PongServer(usid));
                    },
                    _ => {}
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
