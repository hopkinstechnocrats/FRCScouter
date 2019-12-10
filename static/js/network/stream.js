// globals
let IP = "localhost";
let PORT = "4001";
let ACTIVE_CONNECTION = false;
let CONNECTION;
let PACKET_BUFFER = [];

/**
 * Starts a new connection if there is not one running.
 */
function start_connection() {
    if (ACTIVE_CONNECTION) {
        console.log("Warning: a connection was already active when start_connection was called.");
    }
    else {
        CONNECTION = new WebSocket("ws://" + IP + ":" + PORT);
        CONNECTION.onmessage = function(event) {
            let data = event.data;
            let packets = packets_from_raw(data);
            for (let i = 0; i < packets.length; i++) {
                PACKET_BUFFER.push(packets[i]);
            }
        }
        CONNECTION.onopen = async function(event) {
            ACTIVE_CONNECTION = true;
            // ping for USID
            CONNECTION.send(
                raw_from_packets(
                    [
                        {
                            packet_type: 0
                        }
                    ]
                )
            );
            await block_for_packet();
            if (!is_packet_avalable()) {
                console.error("PACKET NOT AVALABLE AFTER BLOCKING FOR PACKET!!");
            }
            let packet = get_packet();
            console.log(packet);
        }
        CONNECTION.onclose = function(event) {
            ACTIVE_CONNECTION = false;
        }
    }
}

function is_packet_avalable() {
    if (PACKET_BUFFER.length > 0) {
        return true;
    }
    return false;
}

function get_packet() {
    return PACKET_BUFFER.pop();
}

async function block_for_packet() {
    console.log("blocking for packet");
    let promise = new Promise(function(resolve, reject) {
        console.log("promise fn");
        setTimeout(
            async function() {
                if (is_packet_avalable) {
                    console.log("packet aval");
                    resolve("done")
                }
                else {
                    console.log("no packet, looping.");
                    await promise.then(
                        result => resolve("done"),
                        error => resolve("done")
                    )
                }
            },
            10
        );
    });
    let a;
    await promise.then(
        result => a,
        error => a
    );
    console.log("packet received, stoping block");
}
