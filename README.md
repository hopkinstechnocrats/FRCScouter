FRCScouter
===
A robust and easy to use robot scouting tool, all contained in one highly scalable cross-platform website.

Setting it up 
---
- [Download](https://github.com/hopkinstechnocrats/FRCScouter/releases) the latest distributed package
- Unzip the file
- Run the executable
- If you'd like to use this website externaly, forward the ports 80 and 81.
- [Visit the site!](localhost)

Building from Source
---
- Make sure you have nightly [Rust](https://rust-lang.org) installed and updated (`rustup install nightly`/`rustup update nightly`)
- If wanted, change `Rocket.toml` to a diffrent address/port
- `cargo build --release`
- Put the `static` folder in the same location as the generated executable (`target/release/frcscouter.exe`)
- Also put `Rocket.toml` alongside these
- Enjoy!

Project Structure
---
```
src         ; Backend Rust server
static      ; Frontend HTML/JS/CSS
Cargo.toml  ; Rust project config
Rocket.toml ; Rust server IP/Port
```
