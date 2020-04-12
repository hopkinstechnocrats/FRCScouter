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

function reset_and_load_site() {
    NETWORK.data.page_loading_state = 0;
    NETWORK.data.homepage = {};
    NETWORK.data.plugin_list = [];
    load_site();
}

function load_site() {
    clear_page();
    create_text_massive("Transfering data from server...");
    if (NETWORK.data.page_loading_state == 0) {
        create_text("- homepage");
        server_request({"request": "get-page", "page": "homepage"});
        NETWORK.data.page_loading_state += 1;
    }
    else if (NETWORK.data.page_loading_state == 1) {
        create_text("- homepage");
        if (NETWORK.data.homepage.version != undefined) {
            NETWORK.data.page_loading_state += 1;
        }
    }
    else if (NETWORK.data.page_loading_state == 2) {
        create_text("+ homepage");
        create_text("X dataviewer");
        create_text("- plugins");
        server_request({"request": "plugins"});
        NETWORK.data.page_loading_state += 1;
        
    }
    else if (NETWORK.data.page_loading_state == 3) {
        create_text("+ homepage");
        create_text("X dataviewer");
        create_text("- plugins");
        if (NETWORK.data.plugin_list[0] != undefined) {
            NETWORK.data.page_loading_state += 1;
        }
    }
    else if (NETWORK.data.page_loading_state == 4) {
        create_text("+ homepage");
        create_text("X dataviewer");
        create_text("+ plugins");
    }
    if (NETWORK.data.page_loading_state < 10) {
        setTimeout(load_site, 50);
    }
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
