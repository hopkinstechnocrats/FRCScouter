// FRCScouter is not snake case, but we want it that way
#![allow(non_snake_case)]

// Import rocket macros with nightly tools
#![feature(proc_macro_hygiene, decl_macro)]
extern crate rocket;

// Import the static hosting tool
use rocket_contrib::serve::StaticFiles;
// WebSockets, `roboconnect`, and rocket all run in parallel
use std::thread;

mod server;

fn main() {
    // Create and launch rocket website (see /static), on localhost::[rocket.toml]
    // This is done in a new thread
    let website = thread::spawn(move || {
        rocket::ignite()
            .mount("/", StaticFiles::from("static"))
            .launch();
    });

    // Launch websocket server in a new thread
    thread::spawn(move || {
        server::launch_websocket();
    });

    // In the event that `server::launch_websocket()` somehow exits,
    // we block until user force quits (this area *should* be unreachable)
    match website.join() {
        Ok(_) => {
            println!("Sucsesfully exited.");
        }
        Err(_) => {
            println!("An error occured joining website thread to main thread.");
        }
    }
}
