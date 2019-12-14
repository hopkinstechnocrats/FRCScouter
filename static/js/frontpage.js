/**
 * frontpage.js provides functions and tools used by the inital
 * content declared in `index.html`
 */

/**
 * Creates a socket connection to make sure everything is working
 */
function check_server_connection() {
    let result = document.getElementById("serverconnection");
    let tmp_socket = new WebSocket("ws://" + IP + ":" + PORT);
    tmp_socket.onopen = function(event) {
        let newnode = document.createElement("p");
        newnode.innerHTML = "A connection was established with the remote server ✅";
        let newnode2 = document.createElement("p");
        newnode2.innerHTML = "Closing connection in 5 seconds...";
        result.appendChild(newnode);
        result.appendChild(newnode2);
    };
    tmp_socket.onclose = function(event) {
        let newnode = document.createElement("p");
        newnode.innerHTML = "A connection was ended with the remote server ❌";
        result.appendChild(newnode);
    }
    tmp_socket.onerror = function(event) {
        let newnode = document.createElement("p");
        newnode.innerHTML = "An error occured talking to the remote server ❌";
        result.appendChild(newnode);
    }
    tmp_socket.onmessage = function(event) {
        let newnode = document.createElement("p");
        newnode.innerHTML = "A message was recived from the remote server ✅";
        result.appendChild(newnode);
    }
    setTimeout(function() { check_server_connection_close(tmp_socket); }, 5000);
}

/**
 * Closes the socket connection created by check_server_connection after a delay
 */
function check_server_connection_close(tmp_socket) {
    let result = document.getElementById("serverconnection");
    tmp_socket.onclose = function(event) {
        let newnode = document.createElement("p");
        newnode.innerHTML = "Socket connection closed with the remote server ✅";
        let newnode2 = document.createElement("p");
        newnode2.innerHTML = "Tests completed sucessfully! (2/2 ✅)";
        result.appendChild(newnode);
        result.appendChild(newnode2);
    }
    tmp_socket.close();
}

/**
 * Provides a callback for the main page's scouting button to start doing things
 */
function start_scouter() {
    clear_page();
    load_scouter_base();
}

/**
 * Removes everything inside of the body tags of the page
 */
function clear_page() {
    let doc = document.getElementById("content");
    while (doc.firstChild) {
        doc.removeChild(doc.firstChild);
    }
}
