// data.rs provides structs and enums to represent data recived from clients as we store it before
// usage.

#[derive(Clone, Eq, PartialEq, Debug)]
/// The WebSocket server's state and storage
pub struct Data {
    attempted_shots: Vec<(ShotLocation, BinLocation, Succeeded, GameStage, TeamNumber, MatchNumber, Timestamp)>
}

impl Data {
    /// Creates a new Data instance
    pub fn new() -> Data {
        Data {
            attempted_shots: vec![]
        }
    }
    pub fn attempted_shot(&mut self, sl: ShotLocation, bl: BinLocation, su: Succeeded, gs: GameStage, tn: TeamNumber, mn: MatchNumber) {
        self.attempted_shots.push((sl, bl, su, gs, tn, mn, Timestamp::now()));
    }
}

#[derive(Clone, Copy, Eq, PartialEq, Debug)]
// Represents a position on the play field
pub enum ShotLocation {
    BlueGoalLeft,
    BlueGoalRight,
    CenterLeft,
    CenterRight,
    RedGoalLeft,
    RedGoalRight,
}

impl ShotLocation {
    // Attempts to convert an `&str` into a `ShotLocation`.
    pub fn from_str(from: &str) -> Option<ShotLocation> {
        match from.to_lowercase().as_str() {
            "bluegoalleft" => return Some(ShotLocation::BlueGoalLeft),
            "bluegoalright" => return Some(ShotLocation::BlueGoalRight),
            "centerleft" => return Some(ShotLocation::CenterLeft),
            "centerright" => return Some(ShotLocation::CenterRight),
            "redgoalleft" => return Some(ShotLocation::RedGoalLeft),
            "redgoalright" => return Some(ShotLocation::RedGoalRight),
            _ => return None
        }
    }
}

#[derive(Clone, Copy, Eq, PartialEq, Debug)]
// Enumerates if something is related to a higher or lower goal on the field.
pub enum BinLocation {
    High,
    Low
}

impl BinLocation {
    // Attempts to convert an `&str` into a `BinLocation`.
    pub fn from_str(from: &str) -> Option<BinLocation> {
        match from.to_lowercase().as_str() {
            "high" => return Some(BinLocation::High),
            "low" => return Some(BinLocation::Low),
            _ => return None
        }
    }
}


#[derive(Clone, Copy, Eq, PartialEq, Debug)]
// Used to represent if a shot has succeeded or not.
pub enum Succeeded {
    True,
    False
}

impl Succeeded {
    // Attempts to convert an `&str` into a `Succeeded`.
    pub fn from_str(from: &str) -> Option<Succeeded> {
        match from.to_lowercase().as_str() {
            "true" => return Some(Succeeded::True),
            "false" => return Some(Succeeded::False),
            _ => return None
        }
    }
}

#[derive(Clone, Copy, Eq, PartialEq, Debug)]
// Used to represent what stage of the game is currently occuring.
pub enum GameStage {
    Autonomous,
    Teleoperated
}

impl GameStage {
    // Attempts to convert an `&str` into a `GameStage`.
    pub fn from_str(from: &str) -> Option<GameStage> {
        match from.to_lowercase().as_str() {
            "autonomous" => return Some(GameStage::Autonomous),
            "teleoperated" => return Some(GameStage::Teleoperated),
            _ => return None
        }
    }
}


#[derive(Clone, Eq, PartialEq, Debug)]
pub struct Timestamp {

}

impl Timestamp {
    pub fn now() -> Timestamp {
        Timestamp {
            
        }
    }
}

#[derive(Clone, Eq, PartialEq, Debug)]
pub struct TeamNumber {
    num: u32
}

impl TeamNumber {
    pub fn new(number: u32) -> TeamNumber {
        TeamNumber {
            num: number
        }
    }
    pub fn get(&mut self) -> u32 {
        self.num
    }
}


#[derive(Clone, Eq, PartialEq, Debug)]
pub struct MatchNumber {
    num: u32
}

impl MatchNumber {
    pub fn new(number: u32) -> MatchNumber {
        MatchNumber {
            num: number
        }
    }
    pub fn get(&mut self) -> u32 {
        self.num
    }
}
