// data.rs provides structs and enums to represent data recived from clients as we store it before
// usage.

use crate::server::network::packet;

#[derive(Clone, Eq, PartialEq, Debug)]
/// The WebSocket server's state and storage
pub struct ServerData {
    usid: usize,
    unchecked_data: Vec<Chunk>,
    data: Stats,
    connected_ips: Vec<ws::Sender>,
    pub start_game_flag: bool,
    pub robots_scouted: Vec<(usize, usize)>, // usid, robot
    pub usid_association: Vec<(usize, usize)>, // usid, internal
}

impl ServerData {
    /// Creates a new ServerData
    pub fn new() -> ServerData {
        ServerData {
            usid: 0,
            unchecked_data: vec![],
            data: Stats::new(),
            connected_ips: vec![],
            start_game_flag: false,
            robots_scouted: vec![],
            usid_association: vec![]
        }
    }
    /// Gets a unique USID (User Session IDentification) and increments the interal USID counter
    pub fn get_next_usid(&mut self) -> usize {
        self.usid += 1;
        return self.usid;
    }
    /// Adds unchecked data to the local state
    pub fn add_data(&mut self, chunk: Chunk) {
        self.unchecked_data.push(chunk);
    }
    /// Adds a new connection to the list of active connections
    pub fn new_connection(&mut self, connection: ws::Sender) {
        self.connected_ips.push(connection);
    }
    /// Gives amount of connections in the list of active connections
    pub fn amount_connected(self) -> usize {
        return self.connected_ips.len();
    }
    /// Removes a connection from the list of active connections by index
    pub fn remove_connection(&mut self, index: usize) {
        self.connected_ips.remove(index);
    }
    /// Returns all Chunks aquired after a certain time.
    pub fn get_chunks_after(self, after: std::time::SystemTime) -> Vec<Chunk> {
        let mut qualifying_packets = vec![];
        for i in self.unchecked_data {
            if i.time > after {
                qualifying_packets.push(i.clone());
            }
        }
        return qualifying_packets;
    }
    /// Gets a clone of all connections
    pub fn get_connections(self) -> Vec<ws::Sender> {
        return self.connected_ips.clone();
    }
}

#[derive(Clone, Eq, PartialEq, Copy, Debug)]
/// A Chunk represents any data from a client. It has the USID of the client who sent the data and a
/// block containing the actual data.
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
/// A Block is a set of data without any tagging information. These are used almost exclusively in
/// constructing Chunks
pub enum Block {
    /// Client declares the robot they are tracking
    G2020RobotDeclaration(usize),
    /// The client connected to this packet is doing some ping buisness
    ClientPingRelated(usize, usize),
}

/// Stats represents processed data on the server. It is what should be pulled by dataviewer on
/// client side.
#[derive(Clone, Eq, PartialEq, Debug)]
pub struct Stats {
    /// Number of active scouters
    pub num_scouting: usize,
    /// List of all bot numbers being scouted
    pub registered_bots: Vec<usize>,
}

impl Stats {
    /// Creates a new default Stats
    pub fn new() -> Stats {
        return Stats {
            num_scouting: 0,
            registered_bots: vec![]
        };
    }
}
