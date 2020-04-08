Building from Source
---
- Make sure you have nightly [Rust](https://rust-lang.org) installed and updated (`rustup install nightly`/`rustup update nightly`)
- If wanted, change `Rocket.toml` to a diffrent address/port
- `cargo build --release`
- Put the `static` folder in the same location as the generated executable (`target/release/frcscouter.exe`)
- Set `static/js/network.js`'s IP variable to be the ip of your server
- Also put `Rocket.toml` alongside these
- Enjoy!

[Back to API Homepage](https://github.com/hopkinstechnocrats/FRCScouter/blob/master/docs/index.md)
---
