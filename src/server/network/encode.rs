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
            },
            Packet::G2020PreloadedCells(cells) => {
                fin += &format!("d;{};", cells);
            },
            Packet::G2020AutoShot(high, missed) => {
                let val1;
                let val2;
                if high { val1 = 1 } else { val1 = 0 }
                if missed { val2 = 1 } else { val2 = 0 }
                fin += &format!("e;{};{};", val1, val2);
            },
            Packet::G2020AutoLine(passed) => {
                let val;
                if passed { val = 1 } else { val = 0 }
                fin += &format!("f;{};", val);
            },
            Packet::G2020TeleShot(high, missed) => {
                let val1;
                let val2;
                if high { val1 = 1 } else { val1 = 0 }
                if missed { val2 = 1 } else { val2 = 0 }
                fin += &format!("g;{};{};", val1, val2);
            },
            Packet::G2020PositionControl() => {
                fin += "h";
            },
            Packet::G2020RotationControl() => {
                fin += "i";
            },
            Packet::G2020AttemptedClimb(moved, balenced, good) => {
                let val1;
                let val2;
                let val3;
                if moved { val1 = 1 } else { val1 = 0 }
                if balenced { val2 = 1 } else { val2 = 0 }
                if good { val3 = 1 } else { val3 = 0 }
                fin += &format!("j;{};{};{};", val1, val2, val3);
            }
            Packet::G2020EndGameQuestions(q1, q2, q3, q4, state1, state2) => {
                // no. there has to be a btter way to do this, but frankly I don't have the time or
                // energy to find it and fix this
                let val1;
                let val2;
                let val3;
                let val4;
                if q1 { val1 = 1 } else { val1 = 0 }
                if q2 { val2 = 1 } else { val2 = 0 }
                if q3 { val3 = 1 } else { val3 = 0 }
                if q4 { val4 = 1 } else { val4 = 0 }
                fin += &format!("k;{};{};{};{};{};{};", val1, val2, val3, val4, state1, state2);
            }
        }
    }
    return fin;
}
