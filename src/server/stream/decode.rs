use super::Stream;
use crate::server::packet::Packet;

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
            other => {
                println!("WARNING: AN UNKNOWN TOKEN WAS FOUND WHILST PARSING A STREAM: `{}`", other);
            }
        }
    }
    return fin;
}
