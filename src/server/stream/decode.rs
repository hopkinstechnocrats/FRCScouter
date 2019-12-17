use super::Stream;
use crate::server::packet::Packet;

/// Translates a string into a stream of packets to be
/// used for local processing and handling
pub fn stream_from_raw(raw: &str) -> Stream {
    let mut fin = Stream::new();
    let mut data_chunks = raw.split(';');
    for i in data_chunks.next() {
        match i {
            "0" => {
                fin.packets.push(Packet::PingUSID());
            },
            "1" => {
                fin.packets.push(
                    Packet::PongUSID(
                        data_chunks.next().unwrap_or_else(|| {
                            panic!("A recived packet PongUSID could not be decoded because there was not sufficent data.");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            panic!("A recived packet PongUSID could not be decoded because its first data is not parsable as a usize");
                        })
                    )
                );
            },
            "2" => {
                fin.packets.push(
                    Packet::PingServer(
                        data_chunks.next().unwrap_or_else(|| {
                            panic!("A recived packet PingServer could not be decoded because there was not sufficent data.");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            panic!("A recived packet PingServer could not be decoded because its first data is not parsable as a usize");
                        })
                    )
                )
            },
            "3" => {
                fin.packets.push(
                    Packet::PongServer(
                        data_chunks.next().unwrap_or_else(|| {
                            panic!("A recived packet PongServer could not be decoded because there was not sufficent data.");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            panic!("A recived packet PongServer could not be decoded because its first data is not parsable as a usize");
                        })
                    )
                )
            },
            "4" => {
                fin.packets.push(
                    Packet::PingClient()
                )
            },
            "5" => {
                fin.packets.push(
                    Packet::PongClient(
                        data_chunks.next().unwrap_or_else(|| {
                            panic!("A recived packet PongClient could not be decoded because there was not sufficent data.");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            panic!("A recived packet PongClient could not be decoded because its first data is not parsable as a usize");
                        })
                    )
                )
            },
            other => {
                println!("WARNING: AN UNKNOWN TOKEN WAS FOUND WHILST PARSING A STREAM: `{}`", other);
            }
        }
    }
    return fin;
}
