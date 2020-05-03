function load_network_site() {
    NETWORK.data.exists = true;
    Cookies.set("data", NETWORK.data);
    clear_page();
    read_page(NETWORK.data.homepage);
}

function set_env(env, val) {
    if (get_env(env) == null) {
        NETWORK.data.env_data.push({key: env, value: val});
        return;
    }
    else {
        for (let i = 0; i < NETWORK.data.env_data.length; i++) {
            if (NETWORK.data.env_data[i].key == env) {
                NETWORK.data.env_data[i].value = val;
                return;
            }
        }
        console.error("Critical and unexpected error during set_env!");
    }
}

function get_env(env) {
    for (let i = 0; i < NETWORK.data.env_data.length; i++) {
        if (NETWORK.data.env_data[i].key == env) {
            return NETWORK.data.env_data[i].value;
        }
    }
    console.error("Unable to locate env param.");
    return null;
}

function gotopage(page) {
    if (page == "games") {
        clear_page();
        for (let i = 0; i < NETWORK.data.loaded_plugins.length; i++) {
            console.log(NETWORK.data.loaded_plugins[i]);
            for (let j = 0; j < NETWORK.data.loaded_plugins[i].map.length; j++) {
                let plug_component = NETWORK.data.loaded_plugins[i].map[j];
                if (plug_component.trigger == "gameselect") {
                    read_page(JSON.parse(plug_component.content));
                    create_break();
                }
            }
        }
        return;
    }
    for (let i = 0; i < NETWORK.data.loaded_plugins.length; i++) {
        for (let j = 0; j < NETWORK.data.loaded_plugins[i].map.length; j++) {
            let plug_component = NETWORK.data.loaded_plugins[i].map[j];
            if (plug_component.name == page || (NETWORK.data.loaded_plugins[i].plugin + ":" + plug_component.name) == page) {
                if (plug_component.trigger == "oncall") {
                    clear_page();
                    read_page(JSON.parse(plug_component.content));
                    return;
                }
                else {
                    console.error("Call to non oncall page!");
                }
            }
        }
    }
    console.error("Page not found with name trigger " + page + "!");
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
