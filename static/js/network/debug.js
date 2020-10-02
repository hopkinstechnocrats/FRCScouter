function create_homepage_button() {
    if (SCOUTER.network.ever_connected) {
        let doc = document.getElementById("content");
        let node = document.createElement("p");
        let text = document.createTextNode("Sever online ✅");
        node.appendChild(text);
        node.setAttribute("onclick", "view_network_debug();");
        doc.appendChild(node);
    }
    
}

function view_network_debug() {
    clear_page();
    create_text_massive("Network info 📈");
    create_text("Netcode version: " + SCOUTER.network.netcode);
    create_text("Current IP: " + SCOUTER.network.ip);
    create_text("Current port: " + SCOUTER.network.port)
    create_button("Go back 🔙", "load_page();");
}
