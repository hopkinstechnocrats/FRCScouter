// data.rs provides structs and enums to represent data recived from clients as we store it before
// usage.

use crate::server::network::packet;

#[derive(Clone, Eq, PartialEq, Debug)]
/// The WebSocket server's state and storage
pub struct ServerData {
    /// represents the highest unique ID handed out by the server.
    usid: usize,
    /// represents the current game's ID number
    pub game: usize,
    /// represents all the received data and packets to the server.
    pub packets: PacketList,
    /// represents all the client connections
    connected_ips: Vec<ws::Sender>,
    /// marks if a match is starting
    pub start_game_flag: bool,
    /// marks the ID of the user as well as the particular robot being scouted
    pub robots_scouted: Vec<(usize, usize)>, // usid, robot
    /// marks the scouting applicability of a usid to a specified game
    pub game_scouters: Vec<Vec<(usize, usize)>>,
    /// associates IDs with internal indexes (see `connected_ips`)
    pub usid_association: Vec<(usize, usize)>, // usid, internal
    pub recent_clear: bool,
    /// reperesents the current login password for the admin portal
    pub admin_pass: usize,
    /// represents a long token to confirm identitiy
    pub token: String,
}

impl ServerData {
    /// Creates a new ServerData
    pub fn new() -> ServerData {
        let mut a = ServerData {
            usid: 0,
            game: 0,
            packets: PacketList::new(),
            connected_ips: vec![],
            start_game_flag: false,
            robots_scouted: vec![],
            game_scouters: vec![],
            usid_association: vec![],
            recent_clear: false,
            admin_pass: 2239,
            token: String::from("NOTOKEN"),
        };
        a.gen_token();
        return a;
    }
    pub fn gen_token(&mut self) -> String {
        let mut rng = rand::thread_rng();
        use rand::Rng;
        let a: u128 = rng.gen();
        let b: u128 = rng.gen();
        let c: u128 = rng.gen();
        self.token = format!("{:X}{:X}{:X}", a, b, c);
        return self.token.clone();
    }
    /// Gets a unique USID (User Session IDentification) and increments the interal USID counter
    pub fn get_next_usid(&mut self) -> usize {
        self.usid += 1;
        return self.usid;
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
    /// Gets a clone of all connections
    pub fn get_connections(self) -> Vec<ws::Sender> {
        return self.connected_ips.clone();
    }
}

#[derive(Clone, Eq, PartialEq, Debug)]
pub struct PacketList {
    pub pings: Vec<WrappedPacket>,
    pub general: Vec<WrappedPacket>,
    pub game: Vec<WrappedPacket>,
}

impl PacketList {
    pub fn new() -> PacketList {
        PacketList {
            pings: vec![],
            general: vec![],
            game: vec![]
        }
    }
    pub fn get_pings_after(self, after: std::time::SystemTime) -> Vec<WrappedPacket> {
        let mut qualifying_packets = vec![];
        for i in self.pings {
            if i.time > after {
                qualifying_packets.push(i.clone());
            }
        }
        return qualifying_packets;
    }
}

#[derive(Clone, Eq, PartialEq, Debug)]
pub struct WrappedPacket {
    pub packet: packet::Packet,
    pub time: std::time::SystemTime,
    pub usid: Option<usize>,
    pub game: Option<usize>,
    pub team: Option<usize>,
}

impl WrappedPacket {
    pub fn new_from_packet(packet: packet::Packet) -> WrappedPacket {
        WrappedPacket {
            packet: packet.clone(),
            time: std::time::SystemTime::now(),
            usid: packet.get_usid(),
            game: None,
            team: None
        }
    }
    pub fn new_with_game(packet: packet::Packet, game: usize) -> WrappedPacket {
        WrappedPacket {
            packet: packet.clone(),
            time: std::time::SystemTime::now(),
            usid: packet.get_usid(),
            game: Some(game),
            team: None
        }
    }
    pub fn new_with_team(packet: packet::Packet, game: usize, team: usize) -> WrappedPacket {
        WrappedPacket {
            packet: packet.clone(),
            time: std::time::SystemTime::now(),
            usid: packet.get_usid(),
            game: Some(game),
            team: Some(team)
        }
    }
}
