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
    // represents the netcode version being used in a client. Used for user facing debugging and API
    // compatibility checking
    netcode: "rev.5.0.0",
    // represents the JSON Page version being used in a client.
    jsonvers: "JSONPage.5.0.0",
    // represents data streamed from the network
    rx_queue: [],
    // represents data waiting to be outgoing onto the network
    tx_queue: [],
    // represents events on network
    waiting: 0,
    // `true` if client is waiting for response. `false` if nothing is queued for network
    network_busy: false,
    // how often in ms to check the network
    network_refresh: 100,
    // amount of refreshes before a network timeout.
    // (network_refresh * network_timeout = timeout_time)
    network_timeout: 50,
    // exactly what it sounds like
    network_timeout_progress: 0,
    // if the server could be sucessfully connected to
    server_found: false,
    // version of netcode used by server
    foriegn_netcode: "NEVER_CONNECTED",
    // represents all received data on the network that may be stored
    data: {
        page_loading_state: 0,
        homepage: {},
        plugin_list: [],
    }
};

// after network stuff is sorted out
setTimeout(() => {
    if (NETWORK.server_found) {
        if (NETWORK.netcode != NETWORK.foriegn_netcode) {
            // show netcode error
            clear_page();
            create_text_massive("LOCAL NETCODE DOES NOT MATCH FORIEGN NETCODE:");
            create_text(NETWORK.netcode + " vs " + NETWORK.foriegn_netcode);
        }
        else {
            // show main page after loading in fresh material
            reset_and_load_site();
        }
    }
    else {
        // show backed up page
        load_cookie_site();
    }
}, 3000);

// after page loads
server_request({"request": "version"});

/**
 * Requests something from the server.
 * @param {Object} request - Object of request to send
 */
function server_request(request) {
    NETWORK.waiting += 1;
    NETWORK.tx_queue.push(request);
    NETWORK.network_busy = true;
    // create a new connection to IP:PORT
    CONNECTION = new WebSocket("ws://" + IP + ":" + PORT);
    // return response when recieved
    CONNECTION.onmessage = function(e) {
        NETWORK.rx_queue.push(JSON.parse(e.data));
    }
    // send message as soon as we can
    CONNECTION.onopen = function(_) {
        CONNECTION.send(JSON.stringify(NETWORK.tx_queue.shift()));
    }
    network_busy();
}

/**
 * Network loop.
 */
function network_busy() {
    if (NETWORK.rx_queue.length != 0) {
        NETWORK.server_found = true;
        while (NETWORK.rx_queue.length > 0) {
            NETWORK.waiting -= 1;
            let current = NETWORK.rx_queue.pop();
            switch (current.result) {
                case "version":
                    NETWORK.foriegn_netcode = current.version;
                    break;
                case "get-page":
                    if (current.status == "fail") {
                        console.error("Getting page failed: " + current.reason);
                    }
                    else {
                        if (current.page_name == "homepage") {
                            NETWORK.data.homepage = current.page_material;
                        }
                        else {
                            console.error("Unkown page received: " + current.page_name);
                        }
                    }
                    break;
                default:
                    console.error("Unkown switch during network_busy(): " + current.result);
                    break;
            }
        }
    }
    if (NETWORK.waiting == 0) {
        NETWORK.network_busy = false;
    }
    if (NETWORK.network_busy) {
        setTimeout(network_busy, NETWORK.network_refresh);
    }
}
