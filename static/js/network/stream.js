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
let CONNECTION_QUEUED = false;
let NETCODE = "rev.4";
let EVER_CONNECTED = false;
let USID_WATING = false;
let SCOUTERS_READY = false;
let SCOUTERS_INFO = [];
let RUNNING_GAME = -1;
let DATA_QUEUE = {};
let A_STATUS = -1;
let A_TOKEN = "";
let HAS_DATA = false;
let NETWORK_GAMES = [];

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
            if (USID == -1) {
                // update indicatior on main page
                if (!USID_WATING) {
                    USID_WATING = true;
                    let el = document.getElementById("serv");
                    el.innerHTML += "\nWaiting for USID... ❗";
                }
            }
            else {
                // update indicator on main page and create
                load_page();
            }
        }
    }
    else {
        if (FIRST_PAGE) {
            if (!CONNECTION_QUEUED) {
                // update indicator on main page
                let el = document.getElementById("serv");
                el.innerHTML += "\nWaiting on connection to server... ❌";
                el.innerHTML += "\nNETCODE | " + NETCODE;
                start_connection();
            }
        }
        else {
            console.log("Not connected?? CRITICAL");
            clear_page();
            create_text_massive("Disconnected From Server! Please refresh the page.");
        }
    }
}, 20);

/**
 * Starts a new connection if there is not one running. Sets the ACTIVE_CONNECTION flag.
 */
function start_connection() {
    if (ACTIVE_CONNECTION) {
        // This isn't technically possible with current project config, but by the time that anything
        // might cause this to fail I'll have forgotten about it so here's a reminder.
        console.log("Warning: a connection was already active when start_connection was called.");
    }
    else if (!EVER_CONNECTED) {
        CONNECTION_QUEUED = true;
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
                            else {
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
                        }
                        break;
                    case 7:
                        SCOUTERS_INFO = pack.scouters;
                        break;
                    case 8:
                        SCOUTERS_READY = true;
                        break;
                    case 11:
                        RUNNING_GAME = pack.game_id;
                        break;
                    case 22:
                        DATA_QUEUE = JSON.parse(pack.json);
                        HAS_DATA = true;
                        break;
                    default:
                        console.log("Warning: no handler was found for the packet id `" + pack.packet_type + "`");
                        break;
                }
            }
        }
        // When we start the connection
        CONNECTION.onopen = function(_) {
            // mark that the connection is valid
            ACTIVE_CONNECTION = true;
            EVER_CONNECTED = true;
            // grab a usid
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
    else {
        console.log("attempted to reconnect when already connected. yeet. not doing that.");
    }
}
