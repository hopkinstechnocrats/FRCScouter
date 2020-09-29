// FRCScouter is not snake case, but we want it that way
#![allow(non_snake_case)]

// Our frontend and backend run in parallel
use std::thread;

// HTTP static file hosting
use actix_web::*;
use actix_files as fs;

// Backend code
mod backend;
mod data;

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    // Set logging levels for external libraries
    std::env::set_var("RUST_LOG", "actix_server=info,actix_web=info");
    env_logger::init();

    // Watermark
    println!("FRCScouter v{}, designed by team 2239", env!("CARGO_PKG_VERSION"));
    println!("https://github.com/hopkinstechnocrats/FRCScouter");

    // Launch the server backend (see server/mod.rs)
    thread::spawn(move || {
        backend::launch();
    });

    // Launch the server frontend (static file hosting)
    // TODO: before merging to master, remove ".show_files_listing()" and make ./ go directly to
    // index.html
    HttpServer::new(|| {
        App::new().service(fs::Files::new("/", "./static").show_files_listing())
    }).bind("0.0.0.0:80")?
    .run().await
}
