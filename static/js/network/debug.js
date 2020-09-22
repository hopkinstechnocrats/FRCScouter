function create_homepage_button() {
    let doc = document.getElementById("content");
    let node = document.createElement("p");
    let text = document.createTextNode("Connected to server ✅");
    node.appendChild(text);
    node.setAttribute("onclick", "view_network_debug();");
    doc.appendChild(node);
}

function view_network_debug() {
    clear_page();
    create_text_massive("Network info [emoji]");
    create_text("UUID: " + SCOUTER.network.usid);
    create_text("Netcode version: " + SCOUTER.network.netcode);
    create_text("Connection consistency: " + NETCON);
    create_button("Go back [emoji]", "load_page();");
}
