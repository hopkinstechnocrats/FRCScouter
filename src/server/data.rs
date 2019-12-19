// data.rs provides structs and enums to represent data
// recived from clients as we store it before usage.

use crate::server::packet;

#[derive(Clone, Eq, PartialEq, Copy, Debug)]
/// A Chunk represents any data from a client. It has the
/// USID of the client who sent the data and a block
/// containing the actual data.
pub struct Chunk {
    pub client: usize,
    pub time: std::time::SystemTime,
    pub data: Block
}

impl Chunk {
    /// Creates a new Chunk representing a Packet if the Packet can be converted
    pub fn new(packet: packet::Packet) -> Option<Chunk> {
        // If the packet is missing a client we can't continue
        let packet_usid = packet.clone().get_usid();
        if packet_usid.is_none() {
            return None;
        }
        // If the packet is missing data we want, we can't continue
        let packet_block = packet.to_block();
        if packet_block.is_none() {
            return None;
        }

        // Its safe to unwrap here beacuse we've already checked that the types are safe
        return Some(Chunk {
            client: packet_usid.unwrap(),
            time: std::time::SystemTime::now(),
            data: packet_block.unwrap()
        });
    }
}

#[derive(Clone, Eq, PartialEq, Copy, Debug)]
/// A Block is a set of data without any tagging information.
/// These are used almost exclusively in constructing Chunks
pub enum Block {
    /// Client declares the robot they are tracking
    F2019RobotDeclaration(usize),
    /// Client claims a starting position for the robot they are tracking
    F2019StartingPosition(F2019StartingPosition)
}

#[derive(Clone, Eq, PartialEq, Copy, Debug)]
/// Represents the starting position of a robot in the
/// 2019 game.
pub enum F2019StartingPosition {
    FrontLeft,
    FrontCenter,
    FrontRight,
    BackLeft,
    BackRight
}

impl F2019StartingPosition {
    /// Converts a F2019StartingPosition to a number between 0 and 6
    pub fn to_usize(self) -> usize {
        match self {
            F2019StartingPosition::FrontLeft => return 1,
            F2019StartingPosition::FrontCenter => return 2,
            F2019StartingPosition::FrontRight => return 3,
            F2019StartingPosition::BackLeft => return 4,
            F2019StartingPosition::BackRight => return 5
        }
    }
    /// Creates a new F2019StartingPosition using a number between 0 and 6
    /// Returns Err(()) if the number is not between 0 and 6
    pub fn from_usize(num: usize) -> Result<F2019StartingPosition, ()> {
        match num {
            1 => return Ok(F2019StartingPosition::FrontLeft),
            2 => return Ok(F2019StartingPosition::FrontCenter),
            3 => return Ok(F2019StartingPosition::FrontRight),
            4 => return Ok(F2019StartingPosition::BackLeft),
            5 => return Ok(F2019StartingPosition::BackRight),
            _ => return Err(())
        }
    }
}
