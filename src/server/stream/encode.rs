use super::Stream;
use crate::server::packet::Packet;

/// Translates a Stream into a string ready to be sent over
/// the network.
pub fn stream_to_raw(stream: Stream) -> String {
    let mut fin = String::new();
    for i in stream.packets {
        match i {
            Packet::PingUSID() => {
                fin += "0;";
            },
            Packet::PongUSID(usid) => {
                fin += &format!("1;{};", usid);
            },
            Packet::PingServer(usid) => {
                fin += &format!("2;{};", usid);
            },
            Packet::PongServer(usid) => {
                fin += &format!("3;{};", usid);
            },
            Packet::PingClient() => {
                fin += "4;";
            },
            Packet::PongClient(usid) => {
                fin += &format!("5;{};", usid);
            },
            Packet::F2019RobotSelected(usid, robot) => {
                fin += &format!("6;{};{};", usid, robot);
            },
            Packet::F2019StartingPos(usid, position) => {
                fin += &format!("7;{};{};", usid, position.to_usize());
            },
            Packet::F2019CrossAutoLine(usid, did_cross) => {
                fin += &format!("8;{};{};", usid, did_cross);
            }
        }
    }
    return fin;
}
