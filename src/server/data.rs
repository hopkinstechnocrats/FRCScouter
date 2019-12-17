// data.rs provides structs and enums to represent data
// recived from clients as we store it before usage.

#[derive(Clone, Eq, PartialEq, Copy, Debug)]
/// A Chunk represents any data from a client. It has the
/// USID of the client who sent the data and a block
/// containing the actual data.
pub struct Chunk {
    pub client: usize,
    pub data: Block
}

#[derive(Clone, Eq, PartialEq, Copy, Debug)]
/// A Block is a set of data without any tagging information.
/// These are used almost exclusively in constructing Chunks
pub enum Block {
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
