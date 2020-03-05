FRCScouter
===
A robust and easy to use robot scouting tool with built in data analasys. Made for FRC robotics teams, by an FRC robotics team.

Setting it up Locally
---
- [Download](https://github.com/hopkinstechnocrats/FRCScouter/releases) the latest distributed package
- Unzip the file
- Run the executable
- Chnage the IP adress in `static/js/network/steam.js` to the local server
- [Visit the site!](http://127.0.0.1/) (link works locally only)
- If you'd like to use this website externaly, forward the ports 80 and 81

Building from Source
---
- Make sure you have nightly [Rust](https://rust-lang.org) installed and updated (`rustup install nightly`/`rustup update nightly`)
- If wanted, change `Rocket.toml` to a diffrent address/port
- `cargo build --release`
- Put the `static` folder in the same location as the generated executable (`target/release/frcscouter.exe`)
- Set `static/js/network/stream.js`'s IP variable to be the ip of your server
- Also put `Rocket.toml` alongside these
- Enjoy!

Project Structure
---
```
src             ; Backend Rust server
| main.rs       ; Bootstraps the Rust server
| server        ; Contains the server code
| | mod.rs      ; Responds to clients
| | data.rs     ; Describes data structures used
| | ping.rs     ; Pings and checks to connections
| | console.rs  ; Provides the user-facing console
| | network     ; Contains core network utitilies
| | | mod.rs    ; Imports other files
| | | encode.rs ; Encode Token -> String
| | | decode.rs ; Decode String -> Token
| | | stream.rs ; Sends strings over the network
| | | packet.rs ; Describes network packets
static          ; Frontend HTML/JS/CSS
| index.html    ; Base HTML
| main.css      ; Base CSS
| admin         ; Base HTML for /admin
| favicon.ico   ; Page icon
| js            ; Contains all page JS
| | page.js     ; Tools for creating page elements
| | admin.js    ; Page material for admin
| | network     ; Contains network JS
| | | encode.js ; Encode Token -> String
| | | decode.js ; Decode String -> Token
| | | stream.js ; Handle connections and reponding
| | dataviewer  ; View Collected Data JS
| | | base.js   ; It's dataviewer.
| | | canvas.js ; Depreciated, removing soon
| | scouter     ; Contains Scouter code
| | | main.js   ; Base page
| | | 2020      ; 2020 Game
| | | | ...     ; 
Cargo.toml  ; Rust project config
Rocket.toml ; Rust server IP/Port
```
