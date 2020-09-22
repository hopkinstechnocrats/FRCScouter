// FRCScouter is not snake case, but we want it that way
#![allow(non_snake_case)]

// WebSockets, `roboconnect`, and rocket all run in parallel
use std::thread;

use actix_web::*;

use actix_files as fs;

mod server;

#[actix_rt::main]
async fn main() -> std::io::Result<()> {

    // Launch websocket server in a new thread
    thread::spawn(move || {
        server::launch_websocket();
    });

    std::env::set_var("RUST_LOG", "actix_server=info,actix_web=info");
    env_logger::init();

    println!("launching server");
    // Create and launch website on localhost::80
    HttpServer::new(|| {
        App::new().service(fs::Files::new("/", "./static").show_files_listing())
    }).bind("0.0.0.0:80")?
    .run().await
}
