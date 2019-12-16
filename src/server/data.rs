#[derive(Clone, Eq, PartialEq, Copy, Debug)]
pub struct Chunk {
    pub client: usize,
    pub data: Block
}

#[derive(Clone, Eq, PartialEq, Copy, Debug)]
pub enum Block {
    F2019StartingPosition(F2019StartingPosition)
}

#[derive(Clone, Eq, PartialEq, Copy, Debug)]
pub enum F2019StartingPosition {
    FrontLeft,
    FrontCenter,
    FrontRight,
    BackLeft,
    BackRight
}
