use super::Stream;
use crate::server::packet::Packet;

/// Translates a Stream into a string ready to be sent over
/// the network.
pub fn stream_to_raw(stream: Stream) -> String {
    let mut fin = String::new();
    for i in stream.packets {
        match i {
            Packet::PingUSID() => {
                panic!("Cannot construct the packet PingUSID, we are not a client!");
            },
            Packet::PongUSID(usid) => {
                fin += &format!("1;{};", usid);
            },
            Packet::PingServer(_) => {
                panic!("Cannot construct the packet PingServer, we are not a client!");
            },
            Packet::PongServer(usid) => {
                fin += &format!("3;{};", usid);
            },
            Packet::PingClient() => {
                fin += "4;";
            },
            Packet::PongClient(_) => {
                panic!("Cannot construct the packet PongClient, we are not a client!");
            }
        }
    }
    return fin;
}
