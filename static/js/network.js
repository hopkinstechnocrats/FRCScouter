/**
 * stream.js is the main file for network operations on the client
 * side. stream.js contains the basic sending and reciving
 * instructions, and tools to start and end connections.
 */

// This is the IP and port of the remote server's websocket address. This is not the
// port specified in Rocket.toml. The port usually should stay the same. IP will most
// likely need to be configured.
let IP = "68.46.79.147";
// The port to go along with the IP for the server
let PORT = "81";
// Represents all globals used for networking

let NETWORK = {
    // represents the NETCODE version being used in a client. Used for user facing debugging and API
    // compatibility checking
    NETCODE: "rev.5.0.0",
    // tells if the CONNECTION object has triggered onopen
    OPENED_CONNECTION: false
};

setTimeout(() => {
    load_cookie_site();
}, 5000);


/**
 * Requests something from the server.
 * @param {Object} request - Object of request to send
 * @returns {Object} - Object of response
 */
function server_request(request) {
    // create a new connection to IP:PORT
    CONNECTION = new WebSocket("ws://" + IP + ":" + PORT);
    // return response when recieved
    CONNECTION.onmessage = function(e) {
        return e.data;
    }
    // send message as soon as we can
    CONNECTION.onopen = function(_) {
        CONNECTION.send(JSON.stringify(request));
    }
}

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
            // mark that we have opened it, or at least started opening it
            OPENED_CONNECTION = true;
        }
        CONNECTION.onclose = function(_) {
            console.error("CONNECTION should never be closed.");
            clear_page();
            create_text_massive("Disconnected From Server! Please refresh the page.");
            create_break();
        }
    }
    else {
        console.log("attempted to reconnect when already connected. yeet. not doing that.");
    }
}
