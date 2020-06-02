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

// Represents all globals, this should probably get renamed sometime...
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
    // if the server could be sucessfully connected to
    server_found: false,
    // version of netcode used by server
    foriegn_netcode: "NEVER_CONNECTED",
    // represents all received data on the network that may be stored
    data: {
        // tracks the progress getting page materials from network
        page_loading_state: 0,
        requests: 0,
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

// after page loads, request the foriegn server's netcode version. This also does a sanity check on
// if we have a stable connection.
server_request({"request": "version"});

// after page loads, wait 250 ms. If we can find a connection in that time, download site.
// Otherwize, attempt to load from local storage.
setTimeout(() => {
    if (NETWORK.server_found) {
        if (NETWORK.netcode != NETWORK.foriegn_netcode) {
            // show netcode error
            clear_page();
            create_text_massive("You may be using an outdated client. Please check that your server provider has everything up to date.");
            create_text("Local: `" + NETWORK.netcode + "`");
            create_text("Server: `" + NETWORK.foriegn_netcode + "`");
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

/**
 * Creates a connection to the foriegn server with appropriate callbacks
 */
function create_connection() {
    // create a new connection to IP:PORT
    CONNECTION = new WebSocket("ws://" + IP + ":" + PORT);

    CONNECTION.onmessage = function(e) {
        // when we receive a response, buffer it
        NETWORK.rx_queue.push(JSON.parse(e.data));
        // close this now not needed connection
        CONNECTION.close(1000);
        if (NETWORK.waiting > 1) {
            // decrease the tracker for number of things on the network and do the next thing
            NETWORK.waiting -= 1;
            create_connection();
        }
        else {
            // we have no more network activity
            NETWORK.network_busy = false;
            NETWORK.waiting = 0;
        }
    }

    // send our message as soon as we are connected
    CONNECTION.onopen = function(_) {
        CONNECTION.send(JSON.stringify(NETWORK.tx_queue.shift()));
    }
}

/**
 * This function occasionally loops itself via callback if we have network activity to think about
 */
function network_busy() {
    if (NETWORK.rx_queue.length != 0) {
        // if we have incoming data, we know there's a server
        NETWORK.server_found = true;
        while (NETWORK.rx_queue.length > 0) {
            // let's interpret all the data we have waiting
            let current = NETWORK.rx_queue.pop();
            switch (current.result) {
                case "version":
                    NETWORK.foriegn_netcode = current.version;
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
        // if nothing is waiting, we're not busy
        NETWORK.network_busy = false;
    }
    if (NETWORK.network_busy) {
        // if we're busy check back in a little while later
        setTimeout(network_busy, NETWORK.network_refresh);
    }
}
