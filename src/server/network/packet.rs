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
    /// DEPRECIATED, TO BE REMOVED
    _G2020ScoutersWaiting(usize, Vec<(usize, usize)>),
    /// Server tells scouters to begin scouting | packet id `8` | ()
    /// DEPRECIATED, TO BE REMOVED
    _G2020InitateScouting(),
    /// Client sends server request for the scouters that are waiting | packet id `9` | ()
    G2020RequestWaiting(),
    /// Client sends server request for current running match id | packet id `a`/10 | ()
    G2020RequestRunningGameID(),
    /// Server responds with the current running match id | packet id `b`/11 | (id)
    G2020RunningGameID(usize),
    /// Client sends server request to leave queue | packet id `c`/12 | (usid)
    G2020LeaveQueue(usize),
    /// Client sends server number of preloaded power cells | packet id `d`/13 | (robot, match, cells)
    G2020PreloadedCells(usize, usize, usize),
    /// Client sends server an autonoumous shot data | packet id `e`/14 | (robot, match, is_high, did_miss, position)
    G2020AutoShot(usize, usize, bool, bool, usize),
    /// Client sends server the state of the line cross checkbox | packet id `f`/15 | (robot, match, is_checked)
    G2020AutoLine(usize, usize, bool),
    /// Client sends server teleop shot data | packet id `g`/16 | (robot, match, is_high, did_miss, position)
    G2020TeleShot(usize, usize, bool, bool, usize),
    /// Client tells server that position control happened | packet id `h`/17 | (robot, match)
    G2020PositionControl(usize, usize),
    /// Client tells server that rotation control happened | packet id `i`/18 | (robot, match)
    G2020RotationControl(usize, usize),
    /// Client tells server that climbing was attempted | packet id `j`/19 | (robot, match, reposition, balenced, success)
    G2020AttemptedClimb(usize, usize, bool, bool, bool),
    /// Client tells server end game questions | packet id `k`/20 | (robot, match, ctrl_pannel, fouls, can_def, was_defed, was_red, can_def_prof, was_defed_prof)
    G2020EndGameQuestions(usize, usize, bool, bool, bool, bool, bool, usize, usize),
    /// Client tells server it wants data | packet id `l`/21 | (type, id)
    /// type = 0: id = team
    /// type = 1: id = match
    /// type = 2: all (id irrelevant)
    G2020RequestData(usize, usize),
    /// Server sends back data | packet id `m`/22 | (len, json)
    G2020ReturnData(usize, String),
    /// Client reuqests admin access | packet id `n`/23 | (password)
    ARequestAccess(usize),
    /// Server denies access | packet id `o`/24 | ()
    ADenyAccess(),
    /// Server allows access | packet id `p`/25 | (token)
    AGrantAccess(String),
    /// Client sends admin command | packet id `q`/26 | (token, command, data)
    /// command = 1: start match (no data)
    /// command = 2: set password (password)
    /// command = 3: reset games (no data)
    ACommand(String, usize, usize)
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
            _ => { return None }
        }
    }
}
