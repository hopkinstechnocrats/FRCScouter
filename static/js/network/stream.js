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
        ever_connected: false
    }
};

/**
 * Sends a request to the foriegn WebSocket server
 * @param {String} data - A JSON String to be sent over the network
 */
function send_request(data) {
    // Create a new connection
    worker = new WebSocket(
        "ws://" + SCOUTER.network.ip + ":" + SCOUTER.network.port
    );

    // Send the data when the connection is ready
    worker.onopen = function(_) {
        SCOUTER.network.ever_connected = true;
        worker.send(data);
    }

    // Handle all messages received back
    worker.onmessage = function(event) {
        let incoming_data = JSON.parse(event.data);
        handle_incoming_data(incoming_data);
    }
}

/**
 * Manages all data received back from the foriegn WebSocket server
 * @param {Object} data - A valid JSON Object to be handled
 */
function handle_incoming_data(data) {

}
