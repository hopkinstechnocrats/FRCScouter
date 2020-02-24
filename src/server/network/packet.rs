use crate::server::network::{
    decode::*,
    stream::*
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
    /// Pings the server | packet id `2` | (usid)
    PingServer(usize),
    /// Server pongs back | packet id `3` | (usid)
    PongServer(usize),
    /// Pings a client | packet id `4` | (server accociated location)
    PingClient(usize),
    /// Client pongs back | packet id `5` | (usid, server accociated location)
    PongClient(usize, usize),
    /// Client sends the robot it is watching | packet id `6` | (usid, robot number)
    G2020RobotSelected(usize, usize),
    /// Server sends client scouter information | packet id `7` | ([length], Vec<team number, amount> where len = [length])
    G2020ScoutersWaiting(usize, Vec<(usize, usize)>),
    /// Server tells scouters to begin scouting | packet id `8` | ()
    G2020InitateScouting(),
    /// Client sends server request for the scouters that are waiting | packet id `9` | ()
    G2020RequestWaiting(),
    /// Client sends server request for current running match id | packet id `a` | ()
    G2020RequestRunningGameID(),
    /// Server responds with the current running match id | packet id `b` | (id)
    G2020RunningGameID(usize),
    /// Client sends server request to leave queue | packet id `c` | (usid)
    G2020LeaveQueue(usize),
    /// Client sends server number of preloaded power cells | packet id `d` | (number)
    G2020PreloadedCells(usize),
    /// Client sends server an autonoumous shot data | packet id `e` | (is_high, did_miss)
    G2020AutoShot(bool, bool),
    /// Client sends server the state of the line cross checkbox | packet id `f` | (is_checked)
    G2020AutoLine(bool),
    /// Client sends server teleop shot data | packet id `g` | (is_high, did_miss)
    G2020TeleShot(bool, bool),
    /// Client tells server that position control happened | packet id `h` | ()
    G2020PositionControl(),
    /// Client tells server that rotation control happened | packet id `i` | ()
    G2020RotationControl(),
    /// Client tells server that climbing was attempted | packet id `j` | (reposition, balenced, success)
    G2020AttemptedClimb(bool, bool, bool),
    /// Client tells server end game questions | packet id `k` | (ctrl_pannel, fouls, can_def, was_defed, can_def_prof, was_defed_prof)
    G2020EndGameQuestions(bool, bool, bool, bool, usize, usize),
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
    /// Returns the usid inside the packet, if any
    pub fn get_usid(self) -> Option<usize> {
        match self {
            Packet::G2020RobotSelected(a, _) => return Some(a),
            Packet::PingServer(a) => return Some(a),
            Packet::PongClient(a, _) => return Some(a),
            Packet::PongServer(a) => return Some(a),
            Packet::PongUSID(a) => return Some(a),
            Packet::G2020LeaveQueue(a) => return Some(a),
            // I am well aware that all these conditions can be covered with one match arm like
            // `_ => {return None;}` but I'm doing it this way so it errors and reminds me when I
            // add new packets to check that they can't be added here.
            Packet::PingUSID() | Packet::PingClient(_) | Packet::G2020ScoutersWaiting(_, _) |
            Packet::G2020InitateScouting() | Packet::G2020RequestWaiting() |
            Packet::G2020RequestRunningGameID() | Packet::G2020RunningGameID(_) => return None,
            // ah, I gave up
            _ => { return None }
        }
    }
}
