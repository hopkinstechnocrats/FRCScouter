use super::Stream;
use super::packet::Packet;

/// Translates a string into a stream of packets to be used for local processing and handling
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
            "6" => {
                fin.packets.push(
                    Packet::G2020RobotSelected(
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020RobotSelected");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020RobotSelected", "usize");
                        }),
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020RobotSelected");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020RobotSelected", "usize");
                        })
                    )
                )
            },
            "9" => {
                fin.packets.push(Packet::G2020RequestWaiting())
            },
            "a" => {
                fin.packets.push(Packet::G2020RequestRunningGameID())
            },
            "b" => {
                fin.packets.push(
                    Packet::G2020RunningGameID(
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020RunningGameID");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020RunningGameID", "usize");
                        }),
                    )
                )
            },
            "c" => {
                fin.packets.push(
                    Packet::G2020LeaveQueue(
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020LeaveQueue");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020LeaveQueue", "usize");
                        }),
                    )
                )
            },
            "d" => {
                fin.packets.push(
                    Packet::G2020PreloadedCells(
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020PreloadedCells");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020PreloadedCells", "usize");
                        }),
                    )
                )
            },
            "e" => {
                fin.packets.push(
                    Packet::G2020AutoShot(
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020AutoShot");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020AutoShot", "usize -> bool");
                        }) == 1,
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020AutoShot");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020AutoShot", "usize -> bool");
                        }) == 1,
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020AutoShot");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020AutoShot", "usize");
                        })
                    )
                )
            },
            "f" => {
                fin.packets.push(
                    Packet::G2020AutoLine(
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020AutoLine");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020AutoLine", "usize -> bool");
                        }) == 1,
                    )
                )
            },
            "g" => {
                fin.packets.push(
                    Packet::G2020TeleShot(
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020TeleShot");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020TeleShot", "usize -> bool");
                        }) == 1,
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020TeleShot");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020TeleShot", "usize -> bool");
                        }) == 1,
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020TeleShot");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020TeleShot", "usize");
                        })
                    )
                )
            },
            "h" => {
                fin.packets.push(Packet::G2020PositionControl());
            },
            "i" => {
                fin.packets.push(Packet::G2020RotationControl());
            },
            "j" => {
                fin.packets.push(
                    Packet::G2020AttemptedClimb(
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020AttemptedClimb");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020AttemptedClimb", "usize -> bool");
                        }) == 1,
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020AttemptedClimb");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020AttemptedClimb", "usize -> bool");
                        }) == 1,
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020AttemptedClimb");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020AttemptedClimb", "usize -> bool");
                        }) == 1,
                    )
                )
            },
            "k" => {
                fin.packets.push(
                    Packet::G2020EndGameQuestions(
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020EndGameQuestions");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020EndGameQuestions", "usize -> bool");
                        }) == 1,
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020EndGameQuestions");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020EndGameQuestions", "usize -> bool");
                        }) == 1,
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020EndGameQuestions");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020EndGameQuestions", "usize -> bool");
                        }) == 1,
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020EndGameQuestions");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020EndGameQuestions", "usize -> bool");
                        }) == 1,
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020EndGameQuestions");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020EndGameQuestions", "usize");
                        }),
                        data_chunks.next().unwrap_or_else(|| {
                            no_sufficent_data("G2020EndGameQuestions");
                        }).parse::<usize>().unwrap_or_else(|_| {
                            not_parsable("G2020EndGameQuestions", "usize");
                        }),
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
