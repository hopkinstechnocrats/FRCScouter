/**
 * stream.js is the main file for network operations on the client
 * side. stream.js contains the basic sending and reciving
 * instructions, and tools to start and end connections.
 */

// globals
// This is the IP and port of the remote server's websocket address. This is not the
// port specified in Rocket.toml. The port usually should stay the same. IP will most
// likely need to be configured.
let IP = "68.46.79.147";
let PORT = "81";
let ACTIVE_CONNECTION = false;
let CONNECTION;
let USID = -1;
let PINGSTATE = 0;
let FIRST_BUFFER = true;
let FIRST_PAGE = true;

setInterval(() => {
    if (ACTIVE_CONNECTION) {
        PINGSTATE -= 20;
        if (PINGSTATE < 0) {
            if (FIRST_BUFFER) {
                PINGSTATE = 0;
                FIRST_BUFFER = false;
            }
            else {
                console.log("Packet loss! CRITICAL, CHECK CONNECTION (severity: " + PINGSTATE + ")");
                PINGSTATE = 0;
            }
        }
    }
}, 5000);

setInterval(() => {
    if (ACTIVE_CONNECTION) {
        if (FIRST_PAGE) {
            // update indicator on main page and create
            load_page();
        }
    }
    else {
        if (FIRST_PAGE) {
            // update indicator on main page
            let el = document.getElementById("serv");
            el.innerHTML = "Waiting on connection to server... ❌"
            start_connection();
        }
        else {
            console.log("Not connected?? CRITICAL");
            clear_page();
            create_text_massive("Disconnected From Server! Please refresh the page. If you get this\
            page during a competition there may be a critical server error. In this case, DO NOT\
            REFRESH! The page will automagically resume shortly.");
        }
    }
}, 200)

/**
 * Starts a new connection if there is not one running. Sets the ACTIVE_CONNECTION flag.
 */
function start_connection() {
    if (ACTIVE_CONNECTION) {
        // This isn't technically possible with current project config, but by the time that anything
        // might cause this to fail I'll have forgotten about it so here's a reminder.
        console.log("Warning: a connection was already active when start_connection was called.");
    }
    else {
        CONNECTION = new WebSocket("ws://" + IP + ":" + PORT);
        // Maybe we should just suck it up and put all client network logic here?
        // Meh, I'll do that tomorrow
        CONNECTION.onmessage = function(event) {
            let data = event.data;
            let packets = packets_from_raw(data);
            for (let i = 0; i < packets.length; i++) {
                let pack = packets[i];
                switch (pack.packet_type) {
                    case 1:
                        if (USID == -1) {
                            USID = pack.usid;
                            console.log("USID set! (" + USID + ")");
                        }
                        else {
                            console.log("Warning: recived the USID assignment `" + pack.usid + "` while already using `" + USID + "`");
                        }
                        break;
                    case 4:
                        if (USID == -1) {
                            console.log("Warning: no USID avalable when needed (packet responder 4)");
                        }
                        pack.packet_type = 5;
                        pack.usid = USID;
                        CONNECTION.send(
                            raw_from_packets(
                                [
                                    pack
                                ]
                            )
                        );
                        PINGSTATE += 1;
                        break;
                    default:
                        console.log("Warning: no handler was found for the packet id `" + pack.packet_type + "`");
                        break;
                }
            }
        }
        // When we start the connection
        CONNECTION.onopen = function(_) {
            ACTIVE_CONNECTION = true;
            // ping for USID, this isn't really currently used by either end but is
            // still nice to the server when you do it
            CONNECTION.send(
                raw_from_packets(
                    [
                        {
                            packet_type: 0
                        }
                    ]
                )
            );
        }
        CONNECTION.onclose = function(_) {
            ACTIVE_CONNECTION = false;
            console.log("Warning: connection was closed unexpectedly");
        }
    }
}
