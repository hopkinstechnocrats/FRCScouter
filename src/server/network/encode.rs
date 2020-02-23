use super::Stream;
use super::packet::Packet;

/// Translates a Stream into a string ready to be sent over the network.
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
            Packet::PingClient(serverid) => {
                fin += &format!("4;{};", serverid);
            },
            Packet::PongClient(usid, serverid) => {
                fin += &format!("5;{};{};", usid, serverid);
            },
            Packet::G2020RobotSelected(usid, robot) => {
                fin += &format!("6;{};{};", usid, robot);
            },
            Packet::G2020ScoutersWaiting(len, list) => {
                let mut tmp = String::new();
                for i in list {
                    tmp = format!("{}{};{};", tmp, i.0, i.1);
                }
                fin += &format!("7;{};{}", len, tmp)
            },
            Packet::G2020InitateScouting() => {
                fin += "8;";
            },
            Packet::G2020RequestWaiting() => {
                fin += "9;";
            },
            Packet::G2020RequestRunningGameID() => {
                fin += "a;";
            },
            Packet::G2020RunningGameID(id) => {
                fin += &format!("b;{};", id);
            },
            Packet::G2020LeaveQueue(usid) => {
                fin += &format!("c;{};", usid);
            }
        }
    }
    return fin;
}
