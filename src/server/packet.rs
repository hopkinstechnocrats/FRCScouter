use crate::server::stream::{
    decode::*,
    core::*
};

use std::fmt::Debug;

#[derive(Clone, Eq, PartialEq, Debug)]
/// Represents an incoming or outgoing packet on the network.
/// This is somewhat of an intermitinte format for data.
pub enum Packet {
    /// Asks the server for a usid | packet id `0` | ()
    PingUSID(),
    /// Responds for request of usid with one | packet id `1` | (usid)
    PongUSID(usize),
    /// Pings the server | packet id `2`, (usid)
    PingServer(usize),
    /// Server Pongs back | packet id `3`, (usid)
    PongServer(usize),
    /// Pings a client | packet id `4`
    PingClient(),
    /// Client Pongs back | packet id `5`, (usid)
    PongClient(usize),
}

impl Packet {
    /// Translates raw text into a stream and then into packets
    pub fn get_packets_from_raw(raw: &str) -> Vec<Packet> {
        return Packet::get_packets_from_stream(stream_from_raw(raw));
    }
    /// Translates a stream into packets.
    pub fn get_packets_from_stream(stream: Stream) -> Vec<Packet> {
        return stream.packets.clone();
    }
}
