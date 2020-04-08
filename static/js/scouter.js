function load_network_site() {
    clear_page();
    create_text_massive("FRC Scouter 🔍🏃‍♀️");
    create_break();
    create_button("Connect as Scouter 🔌", "ON_GAMES=true;load_scouter_base();");
    create_break(2);
    create_button("View Collected Data 📊", "load_data_base();");
    create_break(2);
    create_text("Connected to server ✅");
    create_text("USID | " + USID);
    create_text("Network | " + NETCODE);
    create_links();
}

function load_cookie_site() {
    if (Cookies.get("exists") == undefined) {
        clear_page();
        create_text_massive("No backed up version of the site could be found. The server may be down or your connection may be poor. Refresh the page when you would like to try again.");
    }
}
