FRCScouter
===
A robust and easy to use robot scouting tool, all contained in one highly scalable cross-platform website.

Setting it up
---
- Get the executable and static folder in the same location.
- Run the executable
- If you'd like to use this website externaly, forward the ports 80 and 81.
- [Visit the site!](localhost)

Building from Source
---
- Make sure you have nightly [Rust](https://rust-lang.org) installed and updated (`rustup install nightly`/`rustup update nightly`)
- Navigate to the right folder and check to make sure `Rocket.toml` is set to the right address/port
- `cargo build`
- Put the static folder in the same location as the generated executable (`/target/debug/frcscouter.exe`)
- Enjoy!
