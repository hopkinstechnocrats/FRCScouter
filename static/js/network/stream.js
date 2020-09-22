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
        inital_ping_buffer: true,
    },
    done_with_init: false,
    first_buffer: true,
    first_page: true
};

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
let HAS_DATA = false;
let NETCON = 0;

setInterval(() => {
    if (SCOUTER.network.connected) {
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
                let data = event.data;
                let packets = packets_from_raw(data);
                for (let i = 0; i < packets.length; i++) {
                    let pack = packets[i];
                    switch (pack.packet_type) {
                        case 1:
                            if (SCOUTER.network.usid == -1) {
                                SCOUTER.network.usid = pack.usid;
                                console.log("USID set! (" + SCOUTER.network.usid + ")");
                            }
                            else {
                                console.log("Warning: recived the USID assignment `" + pack.usid + "` while already using `" + SCOUTER.network.usid + "`");
                            }
                            break;
                        case 4:
                            if (SCOUTER.network.usid == -1) {
                                console.log("Warning: no USID avalable when needed (packet responder 4)");
                            }
                            else {
                                pack.packet_type = 5;
                                pack.usid = SCOUTER.network.usid;
                                SCOUTER.network.ws_connecter.send(
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
        }
    }
}, 20);
