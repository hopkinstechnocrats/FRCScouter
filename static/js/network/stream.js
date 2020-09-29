/**
 * stream.js is the main file for network operations on the client
 * side. stream.js contains the basic sending and reciving
 * instructions, and tools to start and end connections.
 */

// globals
// This is the IP and port of the remote server's websocket address. This is not the
// port specified in Rocket.toml. The port usually should stay the same. IP will most
// likely need to be configured.
SCOUTER = {
    network: {
        netcode: "rev.4.1",
        ip: "68.46.79.147",
        port: "81",
        connected: false,
        waiting_to_connect: false,
        usid: -1,

    },
    done_with_init: false
};

setInterval(() => {
    if (SCOUTER.done_with_init) {
        return;
    }
    if (SCOUTER.network.connected) {
        if (SCOUTER.network.usid == -1) {
            // we're still waiting for usid, idle
            console.log("waiting for usid...");
            return;
        }
        else {
            console.log("done!");
            SCOUTER.done_with_init = true;
            load_page();
        }
    }
    else {
        if (!SCOUTER.network.waiting_to_connect) {
            SCOUTER.network.waiting_to_connect = true;
            SCOUTER.network.ws_connecter = new WebSocket(
                "ws://" + SCOUTER.network.ip + ":" + SCOUTER.network.port
            );
            SCOUTER.network.ws_connecter.onopen = function(_) {
                // mark that the connection is valid
                SCOUTER.network.waiting_to_connect = false;
                SCOUTER.network.connected = true;
                // request a usid
                SCOUTER.network.ws_connecter.send(
                    raw_from_packets(
                        [
                            {
                                packet_type: 0
                            }
                        ]
                    )
                );
            }
            SCOUTER.network.ws_connecter.onclose = function(_) {
                SCOUTER.network.connected = false;
                console.error("Error: the WebSocket connection closed.");
            }
            SCOUTER.network.ws_connecter.onmessage = function(event) {
                let packet = JSON.parse(event.data);
                switch (packet.type) {
                    default:
                        console.warn("Unrecognized packet type '" + packet.type + "'!")
                        break;
                }
            }
        }
    }
}, 20);
