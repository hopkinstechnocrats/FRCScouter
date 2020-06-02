function load_network_site() {
    clear_page();
    read_page(find_page_by_use("base", "base"));
}

/**
 * Locates a JSON page by plugin and name. Returns the JSON Page in Object format.
 * @param {String} plugin - Name of the plugin to look for
 * @param {String} name - Name of the page to look for
 * @returns {Object} - JSON Page Object
 */
function find_page_by_name(plugin, name) {
    for (let i = 0; i < NETWORK.data.loaded_plugins.length; i++) {
        if (NETWORK.data.loaded_plugins[i].plugin == plugin) {
            for (let j = 0; j < NETWORK.data.loaded_plugins[i].map.length; j++) {
                if (NETWORK.data.loaded_plugins[i].map[j].name == use) {
                    return JSON.parse((NETWORK.data.loaded_plugins[i].map[j].content));
                }
            }
            console.error("Unable to find file [" + plugin + ":" + name + "]");
            return;
        }
    }
    console.error("Unable to find plugin " + plugin);
}

/**
 * Locates a JSON page by plugin and use. Returns the JSON Page in Object format.
 * @param {String} plugin - Name of the plugin to look for
 * @param {String} use - Use of the page to look for
 * @returns {Object} - JSON Page Object
 */
function find_page_by_use(plugin, use) {
    for (let i = 0; i < NETWORK.data.loaded_plugins.length; i++) {
        if (NETWORK.data.loaded_plugins[i].plugin == plugin) {
            for (let j = 0; j < NETWORK.data.loaded_plugins[i].map.length; j++) {
                if (NETWORK.data.loaded_plugins[i].map[j].trigger == use) {
                    return JSON.parse((NETWORK.data.loaded_plugins[i].map[j].content));
                }
            }
            console.error("Unable to find use [" + plugin + ":* where * has " + use + "]");
            return;
        }
    }
    console.error("Unable to find plugin " + plugin);
}

/**
 * Sets a variable for a plugin.
 * @param {String} env - Name of variable
 * @param {*} val - Value to set
 */
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

/**
 * Gets a variable for a plugin
 * @param {String} env - Name of variable
 * @returns {*} - The variable's value 
 */
function get_env(env) {
    for (let i = 0; i < NETWORK.data.env_data.length; i++) {
        if (NETWORK.data.env_data[i].key == env) {
            return NETWORK.data.env_data[i].value;
        }
    }
    return null;
}

function gotopage(page) {
    console.log("Loading page " + page);
    for (let i = 0; i < NETWORK.data.loaded_plugins.length; i++) {
        for (let j = 0; j < NETWORK.data.loaded_plugins[i].map.length; j++) {
            let plug_component = NETWORK.data.loaded_plugins[i].map[j];
            if (NETWORK.data.loaded_plugins[i].plugin + ":" + plug_component.name == page) {
                if (plug_component.trigger == "oncall") {
                    clear_page();
                    read_page(JSON.parse(plug_component.content));
                    return;
                }
                else {
                    clear_page();
                    console.warn("Call to non oncall page!");
                    read_page(JSON.parse(plug_component.content));
                    return;
                }
            }
        }
    }
    console.error("Unable to find the page " + page);
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
    create_vers("h1", "Transfering data from server...");
    if (NETWORK.data.plugin_list.length < 1) {
        server_request({"request": "plugins"});
        NETWORK.data.page_loading_state = 10;
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
        create_vers("p", "/ plugins");
        for (let i = 0; i < NETWORK.data.loaded_plugins.length; i++) {
            create_vers("p", " + " + NETWORK.data.plugin_list[i].name);
        }
        create_vers("p", "-- " + NETWORK.data.plugin_list[NETWORK.data.loaded_plugins.length].name);
    }
    else {
        for (let i = 0; i < NETWORK.data.loaded_plugins.length; i++) {
            let actions = find_page_by_use(NETWORK.data.loaded_plugins[i].plugin, "onload").actions;
            if (actions != undefined) {
                for (let j = 0; j < actions.length; j++) {
                    evaluate_action(actions[j]);
                }
            }
        }
        create_vers("p", "All objects loaded. Waiting for main page...");
        LOADING = false;
        save_data();
        setTimeout(load_network_site, 20);
    }
    if (LOADING) {
        setTimeout(load_site, 10);
    }
}

function load_cookie_site() {
    if (load_data() == false) {
        clear_page();
        create_text_massive("No backed up version of the site could be found. The server may be down or your connection may be poor. Refresh the page when you would like to try again.");
    }
    else {
        // since we've apparently loaded the site's contents from local storage, just start running!
        load_network_site();
        create_break(2);
        create_vers("p", "This page is loaded from backed up material. (net " + NETWORK.netcode + ")");
    }
}
