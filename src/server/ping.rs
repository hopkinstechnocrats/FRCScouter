use super::data::ServerData;
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
        for ip in data.get_connections() {
            ip.send(
                stream_to_raw(
                    Stream::new_with_packets(vec![
                        Packet::PingClient()
                    ])
                )
            ).unwrap_or_else(|e| {
                println!("WARN: unable to ping client: `{}`", e);
            });
        }
        // Rest thread before next iteration to not use 100% of thread
        // additionally, don't ping the client N-1 times per second,
        // clogging up the client's inbound packets.
        std::thread::sleep(std::time::Duration::from_millis(1000));
    }
}

/// Ping thread B checks incoming packets and disconnects idle or unresponsive clients. (no pong)
fn ping_thread_b(handle: Arc<Mutex<ServerData>>) -> ! {
    loop {
        // Rest thread before next iteration to not use 100% of thread
        // additionally, don't ping the client N-1 times per second,
        // clogging up the client's inbound packets.
        std::thread::sleep(std::time::Duration::from_millis(1000));
    }
}
