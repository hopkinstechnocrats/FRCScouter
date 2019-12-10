use crate::server::stream::{
    encode::*,
    decode::*,
    core::*
};

use std::fmt::Debug;

#[derive(Clone, Eq, PartialEq, Debug)]
pub enum Packet {
    PingUSID(), // Asks the server for a usid | packet id `0` | ()
    PongUSID(usize), // Responds for request of usid with one | packet id `1` | (usid)
    PingServer(usize), // Pings the server | packet id `2`, (usid)
    PongServer(usize), // Server Pongs back | packet id `3`, (usid)
    PingClient(), // Pings a client | packet id `4`
    PongClient(usize), // Client Pongs back | packet id `5`, (usid)
    
}

impl Packet {
    pub fn get_packets_from_raw(raw: &str) -> Vec<Packet> {
        return Packet::get_packets_from_stream(stream_from_raw(raw));
    }
    pub fn get_packets_from_stream(stream: Stream) -> Vec<Packet> {
        return stream.packets.clone();
    }
}
