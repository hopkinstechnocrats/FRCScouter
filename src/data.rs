// data.rs provides structs and enums to represent data recived from clients as we store it before
// usage.

#[derive(Clone, Eq, PartialEq, Debug)]
/// The WebSocket server's state and storage
pub struct ServerData {
    /// represents the highest unique ID handed out by the server.
    usid: usize,
    /// represents all the received data on the server.
    pub data: GameData,
}

impl ServerData {
    /// Creates a new ServerData
    pub fn new() -> ServerData {
        ServerData {
            usid: 0,
            data: GameData::new(),
        }
    }
    /// Gets a unique USID (User Session IDentification) and increments the interal USID counter
    pub fn get_next_usid(&mut self) -> usize {
        self.usid += 1;
        return self.usid;
    }
}

#[derive(Clone, Eq, PartialEq, Debug)]
pub struct GameData {

}

impl GameData {
    pub fn new() -> GameData {
        GameData {

        }
    }
}
