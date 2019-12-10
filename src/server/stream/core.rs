use crate::server::packet::Packet;

pub struct Stream {
    pub packets: Vec<Packet>
}

impl Stream {
    pub fn new() -> Stream {
        Stream {
            packets: vec![],
        }
    }
    pub fn new_with_packets(packets: Vec<Packet>) -> Stream {
        Stream {
            packets: packets,
        }
    }
}
