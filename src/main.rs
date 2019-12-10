#![feature(proc_macro_hygiene, decl_macro)]
extern crate rocket;

use rocket_contrib::serve::StaticFiles;
use std::thread;

mod server;

fn main() {
    println!("Hello, world!");
    // Create and launch rocket website (see /static), on localhost::[rocket.toml]
    let website = thread::spawn(move || {
        rocket::ignite()
            .mount("/", StaticFiles::from("static"))
            .launch();
    });
    // Our thread continues sucessfully
    println!("non-blocked. Rocket thread isolated.");

    let websocket = thread::spawn(move || {
        // Launch websocket server in a new thread
        println!("launching websocket.");
        server::launch_websocket();
    });

    println!("non-blocked. websocket thread isolated.");
    server::launch_robot();

    // We block until user force quits (this area *should* be unreachable)
    println!("blocking main thread waiting for rocket.");
    match website.join() {
        Ok(_) => {
            println!("Sucsesfully exited.");
        }
        Err(_) => {
            println!("An error occured joining website thread to main thread.");
        }
    }
    match websocket.join() {
        Ok(_) => {

        }
        Err(_) => {

        }
    }
}
