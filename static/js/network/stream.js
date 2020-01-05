/**
 * stream.js is the main file for network operations on the client
 * side. stream.js contains the basic sending and reciving
 * instructions, and tools to start and end connections.
 */

// globals
// This is the IP and port of the remote server's websocket address. This is not the
// port specified in Rocket.toml. The port usually should stay the same. IP will most
// likely need to be configured.
let IP = "localhost";
let PORT = "81";
let ACTIVE_CONNECTION = false;
let CONNECTION;
let PACKET_BUFFER = [];

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
                PACKET_BUFFER.push(packets[i]);
            }
        }
        // When we start the connection
        CONNECTION.onopen = async function(event) {
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
        CONNECTION.onclose = function(event) {
            ACTIVE_CONNECTION = false;
        }
    }
}
