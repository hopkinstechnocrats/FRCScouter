/**
 * stream.js is the main file for network operations on the client
 * side. stream.js contains the basic sending and reciving
 * instructions, and tools to start and end connections.
 */

// This is the IP and port of the remote server's websocket address. This is not the
// port specified in Rocket.toml. The port usually should stay the same. IP should work
// properly but may need to be reconfigured to a string of the IP you're using for WS instead.
let IP = window.location.hostname;
// The port to go along with the IP for the server
let PORT = "81";
// Represents all globals used for networking

let NETWORK = {
    // represents the netcode version being used in a client. Used for user facing debugging and API
    // compatibility checking
    netcode: "rev.5.0.0",
    // represents the JSON Page version being used in a client.
    jsonvers: "JSONPage.1.0.0",
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
        // tracks the progress getting page materials from network
        page_loading_state: 0,
        requests: 0,
        pages_needed: ["homepage", "create", "buildapp"],
        pages_received: [],
        // JSONPages for the base app. I know this should be conrgegated into a plugin, fight me.
        homepage: {},
        create: {},
        buildapp: {},
        // list of all plugins
        plugin_list: [],
        // list of all plugins with data
        loaded_plugins: [],
        // variables and enviroment for plugins/apps
        env_data: []
    }
};

/**
 * Saves data to local machine.
 */
function save_data() {
    window.localStorage.clear();
    window.localStorage.setItem("data", JSON.stringify(NETWORK.data));
    console.log("Saved data to persistent storage.");
    load_data();
}

/**
 * Loads data from local machine.
 * @returns {Boolean} - succeeded in loading data
 */
function load_data() {
    console.log("Attempting to load data from persisitent storage...");
    let data = window.localStorage.getItem("data");
    if (data == null) {
        console.warn("Failed!");
        return false;
    }
    else {
        NETWORK.data = JSON.parse(data);
        console.log("Loaded.");
        return true;
    }
}

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
}, 250);

// after page loads
server_request({"request": "version"});

/**
 * Requests something from the server.
 * @param {Object} request - Object of request to send
 */
function server_request(request) {
    if (NETWORK.waiting < 1) {
        NETWORK.waiting = 1;
    }
    else {
        NETWORK.waiting += 1;
    }
    NETWORK.tx_queue.push(request);
    if (NETWORK.waiting == 1) {
        create_connection();
    }
    NETWORK.network_busy = true;
    network_busy();
}

function create_connection() {
    // create a new connection to IP:PORT
    CONNECTION = new WebSocket("ws://" + IP + ":" + PORT);
    // return response when recieved
    CONNECTION.onmessage = function(e) {
        NETWORK.rx_queue.push(JSON.parse(e.data));
        CONNECTION.close(1000);
        if (NETWORK.waiting > 1) {
            create_connection();
            NETWORK.waiting -= 1;
        }
        else {
            NETWORK.network_busy = false;
            NETWORK.waiting -= 1;
        }
    }
    // send message as soon as we can
    CONNECTION.onopen = function(_) {
        CONNECTION.send(JSON.stringify(NETWORK.tx_queue.shift()));
    }
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
                        else if (current.page_name == "create") {
                            NETWORK.data.create = current.page_material;
                        }
                        else if (current.page_name == "buildapp") {
                            NETWORK.data.buildapp = current.page_material;
                        }
                        else {
                            console.error("Unkown page received: " + current.page_name);
                        }
                    }
                    break;
                case "plugins":
                    NETWORK.data.plugin_list = current.plugins;
                    break;
                case "plugin-data":
                    NETWORK.data.loaded_plugins.push(current);
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
