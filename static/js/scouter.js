function load_network_site() {
    read_page(NETWORK.data.homepage);
}

function gotopage(page) {
    for (let i = 0; i < NETWORK.data.loaded_plugins.length; i++) {
        for (let j = 0; j < NETWORK.data.loaded_plugins[i].objs.length; j++) {
            
        }
    }
}

function reset_and_load_site() {
    NETWORK.data.page_loading_state = 0;
    NETWORK.data.homepage = {};
    NETWORK.data.plugin_list = [];
    load_site();
}


LOADING = true;

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
            NETWORK.data.page_loading_state = 10;
        }
    }
    else if (NETWORK.data.plugin_list.length > NETWORK.data.loaded_plugins.length) {
        if (NETWORK.data.page_loading_state == 10) {
            NETWORK.data.page_loading_state = 11;
            server_request({"request": "plugin-data", "plugin": NETWORK.data.plugin_list[NETWORK.data.requests].name});
            NETWORK.data.requests += 1;
        }
        else {
            if (NETWORK.data.requests == NETWORK.data.loaded_plugins.length) {
                NETWORK.data.page_loading_state = 10;
            }
        }
        create_text("+ homepage");
        create_text("X dataviewer");
        create_text("/ plugins");
        if (NETWORK.data.loaded_plugins.length) {
        }
        for (let i = 0; i < NETWORK.data.loaded_plugins.length; i++) {
            create_text(" + " + NETWORK.data.plugin_list[i].name);
        }
        create_text("-- " + NETWORK.data.plugin_list[NETWORK.data.loaded_plugins.length].name);
    }
    else {
        create_text("All objects loaded. Waiting for main page...");
        LOADING = false;
        setTimeout(load_network_site, 100);
    }
    if (LOADING) {
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
