function load_network_site() {
    clear_page();
    create_text_massive("FRC Scouter 🔍🏃‍♀️");
    create_break();
    create_button("Scout! 🔌📊", "");
    create_break(2);
    create_button("Private rooms", "");
    create_break(2);
    create_text("Connected to server! ✅");
    create_links();
}

function load_site() {
    clear_page();
    create_text_massive("Transfering data from server...");
    server_request({"request": "get-page", "page": "homepage"});
}

function load_cookie_site() {
    if (Cookies.get("exists") == undefined) {
        clear_page();
        create_text_massive("No backed up version of the site could be found. The server may be down or your connection may be poor. Refresh the page when you would like to try again.");
    }
    else {
        clear_page();
        create_text_massive("Load backup site");
    }
}
