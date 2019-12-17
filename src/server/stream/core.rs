use crate::server::packet::Packet;

/// Represents a group of packets accociated with one
/// connection or interaction.
pub struct Stream {
    pub packets: Vec<Packet>
}

impl Stream {
    /// Creates a new Stream
    pub fn new() -> Stream {
        Stream {
            packets: vec![],
        }
    }
    /// Creates a new stream with a predefined set of packets
    pub fn new_with_packets(packets: Vec<Packet>) -> Stream {
        Stream {
            packets: packets,
        }
    }
}
