/// Team number, used to determine some IP addresses
static TEAM_NUMBER: usize = 2239;
/// Number of milliseconds for each connection attempt
static TIMEOUT_MILLS: u64 = 2000;
/// Local port to bind to
static CORE_PORT: usize = 4239;

use std::net::UdpSocket;
use std::net::AddrParseError;
use std::io::Error;

/// Attempts to connect to the robot using various common IP addresses.
pub fn attempt_connection() -> Result<UdpSocket, ()> {
    // create a socket on localhost to connect to
    let socket = ipaddr_local_connect(&format!("127.0.0.1:{}", CORE_PORT));
    // Unwrap the handle, should only panic if socket is occupied,
    // in which case we cannot continue anyways
    let mut socket = socket.unwrap();
    if ipaddr_foreign_connect("127.0.0.1:34254", &mut socket) {
        return Ok(socket);
    }
    if ipaddr_foreign_connect(&format!("10.{}.{}.2:1741", (TEAM_NUMBER / 100) as i8, (TEAM_NUMBER % 100) as i8), &mut socket) {
        return Ok(socket);
    }
    if ipaddr_foreign_connect("127.0.0.1:1741", &mut socket) {
        return Ok(socket);
    }
    if ipaddr_foreign_connect("172.22.11.2:1741", &mut socket) {
        return Ok(socket);
    }
    if ipaddr_foreign_connect(&format!("roboRIO-{}-FRC.local", TEAM_NUMBER), &mut socket) {
        return Ok(socket);
    }
    if ipaddr_foreign_connect(&format!("roboRIO-{}-FRC.lan", TEAM_NUMBER), &mut socket) {
        return Ok(socket);
    }
    if ipaddr_foreign_connect(&format!("roboRIO-{}-FRC.frc-field.local", TEAM_NUMBER), &mut socket) {
        return Ok(socket);
    }
    println!("attempting connection to driverstation");
    let socket = driverstation_connect();
    if socket.is_ok() {
        return Ok(socket.unwrap());
    }
    println!("Error: unable to connect to robot. Exiting robotconnect.");
    return Err(());
}

fn check_data(sock: &mut UdpSocket) -> bool {
    println!("check_data for UdpSocket");
    let mut buffer = [0; 10000];
    println!("buffer created");
    //sock.set_nonblocking(true);
    match sock.recv_from(&mut buffer) {
        Ok((amount, source)) => {
            return true;
        },
        Err(_) => {
            println!("No data on socket!");
            return false;
        }
    }
}

fn ipaddr_local_connect(ipaddr: &str) -> Result<UdpSocket, ()> {
    println!("Attempting to bind to local ip `{}`", ipaddr);
    let mut socket = UdpSocket::bind(ipaddr);
    if socket.is_ok() {
        let mut sock = socket.unwrap();
        sock.set_read_timeout(Some(std::time::Duration::from_millis(TIMEOUT_MILLS)));
        println!("Connected successfully!");
        return Ok(sock);
    }
    else {
        println!("Unable to produce socket: {:?}", socket);
    }
    println!("No connection!");
    return Err(());
}

fn ipaddr_foreign_connect(ipaddr: &str, sock: &mut UdpSocket) -> bool {
    println!("Attempting to bind to foreign ip `{}`", ipaddr);
    match sock.connect(ipaddr) {
        Ok(_) => {
            return check_data(sock);
            return true;
        }
        Err(e) => {
            println!("Could not connect to foreign ip! e:\n{}", e);
            return false;
        }
    }
}

fn driverstation_connect() -> Result<UdpSocket, ()> {
    println!("Attempting to connect to the Driverstation at `127.0.0.1:1742`");
    let mut driverstation_try = UdpSocket::bind("127.0.0.1:1742");
    if !driverstation_try.is_ok() {
        let sock = driverstation_try.unwrap();
        if check_data(&mut sock.try_clone().unwrap()) {
            println!("Connected sucessfully!");
            let mut buffer = [0; 10000];
            let (amount, source) = sock.recv_from(&mut buffer).unwrap_or_else(|_| {
                panic!("Unable to read data from driverstation");
            });
            // invert buffer into bytes properly
            let buffer = &mut buffer[..amount];
            //buffer.reverse();
            println!("Buffer output:\n{:?}", buffer);
            return Ok(sock);
        }
    }
    return Err(());
}
