use super::data::{ServerData, WrappedPacket};
use std::sync::{Arc, Mutex};

use super::network::{
    Stream,
    encode::stream_to_raw,
    packet::Packet
};

// Starts ping thread A in a new thread and consumes active thread for ping thread B. These threads
// are used to maintain connections to clients and check in on them.
pub fn start_ping_threads(handle: Arc<Mutex<ServerData>>) -> ! {
    // double our data handle
    let tmp_handle = Arc::clone(&handle);
    std::thread::spawn(move || {
        ping_thread_a(tmp_handle);
    });
    // ping_thread_b returns ! so we don't have to do anything else
    ping_thread_b(handle);
}

/// Ping thread A sends repeated pings to every client listed as connected to the server.
fn ping_thread_a(handle: Arc<Mutex<ServerData>>) -> ! {
    loop {
        // Grab the server data as a clone, and drop the handle because we don't need it anymore.
        let tmp_data = handle.lock().unwrap();
        let data = tmp_data.clone();
        drop(tmp_data);
        let mut loc = 0;
        for ip in data.clone().get_connections() {
            if data.start_game_flag {
                ip.send(stream_to_raw(Stream::new_with_packets(vec![Packet::G2020InitateScouting()]))).unwrap_or_else(|_| println!("unable to send flag: CRITICAL"));
            }
            ip.send(
                stream_to_raw(
                    Stream::new_with_packets(vec![
                        Packet::PingClient(loc)
                    ])
                )
            ).unwrap_or_else(|e| {
                println!("WARN: unable to ping client: `{}`", e);
            });
            loc += 1;
        }
        if data.start_game_flag {
            println!("A game has started (6 teams being scouted)");
            let mut server = handle.lock().unwrap();
            server.start_game_flag = false;
            server.robots_scouted = vec![];
            server.game += 1;
            drop(server);
        }
        // Rest thread before next iteration to not use 100% of thread additionally, don't ping the
        // client infinite times per second, clogging up the client's inbound packets.
        std::thread::sleep(std::time::Duration::from_millis(250));
    }
}

/// Ping thread B checks incoming packets and disconnects idle or unresponsive clients. (no pong)
fn ping_thread_b(handle: Arc<Mutex<ServerData>>) -> ! {
    loop {
        // Grab the server data. Keep the handled data because we need to change it. Other threads
        // resume when data is dropped, either at the end of the loop or earlier if possible.
        let mut data = handle.lock().unwrap();
        // for every unprocessed packet in the last two seconds, grab and store the usid and server
        // id if it's related to ping/pong processes.
        let mut clientpairs: Vec<(usize, usize)> = vec![];
        for i in data.packets.clone().get_pings_after(std::time::SystemTime::now() - std::time::Duration::from_secs(2)) {
            match i.packet {
                Packet::PongClient(a, b) => {
                    clientpairs.push((a, b));
                },
                _ => {}
            }
        }
        for i in 0..data.clone().amount_connected() {
            let mut passed = false;
            for j in clientpairs.clone() {
                if j.1 == i {
                    passed = true;
                }
            }
            if !passed {
                // if we remove a connection we have to immediately break and pause for 5 seconds 
                // because this changes indexes invalidating packets for a short while
                println!("Disconnecting a client due to inactivity.");
                data.remove_connection(i);
                break;
            }
        }
        // Rest thread before next iteration to not use 100% of thread. Drop data beforehand so that
        // other threads can use it.
        drop(data);
        std::thread::sleep(std::time::Duration::from_millis(5000));
    }
}
