// data.rs provides structs and enums to represent data recived from clients as we store it before
// usage.

#[derive(Clone, Eq, PartialEq, Debug)]
/// The WebSocket server's state and storage
pub struct Data {
    attempted_shots: Vec<(ShotLocation, BinLocation, Succeeded, Timestamp)>
}

impl Data {
    /// Creates a new Data instance
    pub fn new() -> Data {
        Data {
            attempted_shots: vec![]
        }
    }
    pub fn attempted_shot(&mut self, sl: ShotLocation, bl: BinLocation, su: Succeeded) {
        self.attempted_shots.push((sl, bl, su, Timestamp::now()));
    }
}

#[derive(Clone, Copy, Eq, PartialEq, Debug)]
pub enum ShotLocation {
    BlueGoalLeft,
    BlueGoalRight,
    CenterLeft,
    CenterRight,
    RedGoalLeft,
    RedGoalRight,
}

impl ShotLocation {
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
pub enum BinLocation {
    High,
    Low
}

impl BinLocation {
    pub fn from_str(from: &str) -> Option<BinLocation> {
        match from.to_lowercase().as_str() {
            "high" => return Some(BinLocation::High),
            "low" => return Some(BinLocation::Low),
            _ => return None
        }
    }
}

#[derive(Clone, Copy, Eq, PartialEq, Debug)]
pub enum Succeeded {
    True,
    False
}

impl Succeeded {
    pub fn from_str(from: &str) -> Option<Succeeded> {
        match from.to_lowercase().as_str() {
            "true" => return Some(Succeeded::True),
            "false" => return Some(Succeeded::False),
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
