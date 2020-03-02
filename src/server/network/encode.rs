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
            Packet::_G2020ScoutersWaiting(len, list) => {
                let mut tmp = String::new();
                for i in list {
                    tmp = format!("{}{};{};", tmp, i.0, i.1);
                }
                fin += &format!("7;{};{}", len, tmp)
            },
            Packet::_G2020InitateScouting() => {
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
            Packet::G2020PreloadedCells(robo, game, cells) => {
                fin += &format!("d;{};{};{};", robo, game, cells);
            },
            Packet::G2020AutoShot(robo, game, high, missed, position) => {
                let val1;
                let val2;
                if high { val1 = 1 } else { val1 = 0 }
                if missed { val2 = 1 } else { val2 = 0 }
                fin += &format!("e;{};{};{};{};{};", robo, game, val1, val2, position);
            },
            Packet::G2020AutoLine(robo, game, passed) => {
                let val;
                if passed { val = 1 } else { val = 0 }
                fin += &format!("f;{};{};{};", robo, game, val);
            },
            Packet::G2020TeleShot(robo, game, high, missed, position) => {
                let val1;
                let val2;
                if high { val1 = 1 } else { val1 = 0 }
                if missed { val2 = 1 } else { val2 = 0 }
                fin += &format!("g;{};{};{};{};{};", robo, game, val1, val2, position);
            },
            Packet::G2020PositionControl(robo, game) => {
                fin += &format!("h;{};{};", robo, game);
            },
            Packet::G2020RotationControl(robo, game) => {
                fin += &format!("i;{};{};", robo, game);
            },
            Packet::G2020AttemptedClimb(robo, game, moved, balenced, good) => {
                let val1;
                let val2;
                let val3;
                if moved { val1 = 1 } else { val1 = 0 }
                if balenced { val2 = 1 } else { val2 = 0 }
                if good { val3 = 1 } else { val3 = 0 }
                fin += &format!("j;{};{};{};{};{};", robo, game, val1, val2, val3);
            },
            Packet::G2020EndGameQuestions(robo, game, q1, q2, q3, q4, q5, state1, state2) => {
                // no. there has to be a btter way to do this, but frankly I don't have the time or
                // energy to find it and fix this
                let val1;
                let val2;
                let val3;
                let val4;
                let val5;
                if q1 { val1 = 1 } else { val1 = 0 }
                if q2 { val2 = 1 } else { val2 = 0 }
                if q3 { val3 = 1 } else { val3 = 0 }
                if q4 { val4 = 1 } else { val4 = 0 }
                if q5 { val5 = 1 } else { val5 = 0 }
                fin += &format!("k;{};{};{};{};{};{};{};{};{};", robo, game, val1, val2, val3, val4, val5, state1, state2);
            },
            Packet::G2020RequestData(typeto, data) => {
                fin += &format!("l;{};{};", typeto, data);
            },
            Packet::G2020ReturnData(len, json) => {
                fin += &format!("m;{};{};", len, json);
            },
            Packet::ARequestAccess(req) => {
                fin += &format!("n;{};", req);
            },
            Packet::ADenyAccess() => {
                fin += "o;";
            },
            Packet::AGrantAccess(token) => {
                fin += &format!("p;{};", token);
            },
            Packet::ACommand(token, command, data) => {
                fin += &format!("q;{};{};{};", token, command, data);
            }
        }
    }
    return fin;
}
