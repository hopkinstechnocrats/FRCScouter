use super::Stream;
use super::packet::Packet;

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
                            no_sufficent_data("PongUSID");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("PongUSID", "usize");
                        })
                    )
                );
            },
            "2" => {
                fin.packets.push(
                    Packet::PingServer(
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("PingServer");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("PingServer", "usize");
                        })
                    )
                )
            },
            "3" => {
                fin.packets.push(
                    Packet::PongServer(
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("PongServer");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("PongServer", "usize");
                        })
                    )
                )
            },
            "4" => {
                fin.packets.push(
                    Packet::PingClient(
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("PingClient");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("PingClient", "usize");
                        })
                    )
                )
            },
            "5" => {
                fin.packets.push(
                    Packet::PongClient(
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("PongClient");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("PongClient", "usize");
                        }),
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("PongClient");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("PongClient", "usize");
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

fn no_sufficent_data(packet_name: &str) -> ! {
    panic!(
        "A recived packet {} could not be decoded because there was not sufficent data in the buffer.",
        packet_name
    );
}

fn not_parsable(packet_name: &str, parsable_as: &str) -> ! {
    panic!(
        "A recived packet {} could not be decoded because some data was not able to be parsed as {}.",
        packet_name,
        parsable_as
    )
}
