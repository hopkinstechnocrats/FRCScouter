PAGEBUILDER = {
    "version": "JSONPage.1.0.0",
    "name": "entry",
    "format": "objects-decending",
    "objects": []
};

DISPLAYMODE = 0;
TEXT_SIZE = "text";
STORED_OBJECT = {};
BUTTON_ACTION = {};

function load_network_site() {
    clear_page();
    read_page(find_page_by_use("base", "base"));
}

function find_page_by_name(plugin, name) {
    for (let i = 0; i < NETWORK.data.loaded_plugins.length; i++) {
        if (NETWORK.data.loaded_plugins[i].plugin == plugin) {
            console.log("plugin located!");
            for (let j = 0; j < NETWORK.data.loaded_plugins[i].map.length; j++) {
                if (NETWORK.data.loaded_plugins[i].map[j].name == use) {
                    console.log("page located!");
                    return JSON.parse((NETWORK.data.loaded_plugins[i].map[j].content));
                }
            }
            console.error("unable to find file [" + plugin + ":" + name + "]");
            return;
        }
    }
    console.error("unable to find plugin " + plugin);
}

function find_page_by_use(plugin, use) {
    for (let i = 0; i < NETWORK.data.loaded_plugins.length; i++) {
        if (NETWORK.data.loaded_plugins[i].plugin == plugin) {
            console.log("plugin located!");
            for (let j = 0; j < NETWORK.data.loaded_plugins[i].map.length; j++) {
                if (NETWORK.data.loaded_plugins[i].map[j].trigger == use) {
                    console.log("page located!");
                    return JSON.parse((NETWORK.data.loaded_plugins[i].map[j].content));
                }
            }
            console.error("unable to find use [" + plugin + ":* where * has " + use + "]");
            return;
        }
    }
    console.error("unable to find plugin " + plugin);
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
    //console.error("Unable to locate env param " + env);
    return null;
}

function gotopage(page) {
    console.log("Going to page: " + page);
    if (page == "pagebuilder") {
        clear_page();
        read_page(PAGEBUILDER);
        if (DISPLAYMODE == 0) { // root
            vers_el("50%", "0", "p", "What do you want to do?");
            vers_el("50%", "20px", "button", "Create an Element", "DISPLAYMODE=1;gotopage(\"pagebuilder\");");
            vers_el("50%", "65px", "button", "Move an Element", "DISPLAYMODE=2;gotopage(\"pagebuilder\");");
            vers_el("50%", "110px", "button", "Import Page", "DISPLAYMODE=4;gotopage(\"pagebuilder\");");
            vers_el("50%", "155px", "button", "Export Page", "DISPLAYMODE=5;gotopage(\"pagebuilder\");");
        }
        else if (DISPLAYMODE == 1) { // create element
            vers_el("50%", "0", "p", "Select an element to create");
            vers_el("50%", "20px", "button", "Text", "TEXT_SIZE=\"text\";DISPLAYMODE=3;gotopage(\"pagebuilder\");");
            vers_el("50%", "65px", "button", "Button", "DISPLAYMODE=6;gotopage(\"pagebuilder\");");
            vers_el("50%", "110px", "button", "Cancel", "DISPLAYMODE=0;gotopage(\"pagebuilder\");");
        }
        else if (DISPLAYMODE == 2) { // move element
            let button_index = 20;
            vers_el("50%", "0", "p", "Move which element?");
            for (let i = 0; i < PAGEBUILDER.objects.length; i++) {
                vers_el("50%", button_index + "px", "button", PAGEBUILDER.objects[i].text, "DISPLAYMODE=7;STORED_OBJECT=PAGEBUILDER.objects.splice(" + i + ",1)[0];gotopage(\"pagebuilder\");");
                button_index += 45;
            }
        }
        else if (DISPLAYMODE == 3) { // create text
            vers_el("50%", "0", "button", "Create Text!", "PAGEBUILDER.objects.push({text:document.getElementById(\"textinput\").value,object_type:TEXT_SIZE});DISPLAYMODE=0;gotopage(\"pagebuilder\");");
            vers_el("50%", "45px", "p", "Text:");
            vers_el("50%", "70px", "input", "", "", "textinput");
            vers_el("50%", "97px", "p", "Text Size:");
            vers_el("50%", "120px", "button", "Small", "TEXT_SIZE=\"text\";");
            vers_el("50%", "165px", "button", "Medium", "TEXT_SIZE=\"text-big\";");
            vers_el("50%", "210px", "button", "Big", "TEXT_SIZE=\"text-massive\";");
        }
        else if (DISPLAYMODE == 4) { // import
            
        }
        else if (DISPLAYMODE == 5) { // export
            vers_el("50%", "0", "p", "{\"version\": \"JSONPage.5.0.0\",\"name\": \"NAME_HERE\",\"format\": \"objects-decending\",\"objects\":" + JSON.stringify(PAGEBUILDER.objects) + "}");
        }
        else if (DISPLAYMODE == 6) { // create button
            vers_el("50%", "0", "button", "Create Button!", "PAGEBUILDER.objects.push({text:document.getElementById(\"textinput\").value,object_type:\"button\"});DISPLAYMODE=0;gotopage(\"pagebuilder\");");
            vers_el("50%", "45px", "p", "Text:");
            vers_el("50%", "70px", "input", "", "", "textinput");
            vers_el("50%", "97px", "p", "On Click:");
            vers_el("50%", "120px", "button", "Load Page", "BUTTON_ACTION={};"); // select page?
            vers_el("50%", "165px", "button", "Finish Scouting", "TEXT_SIZE=\"text-big\";");
            vers_el("50%", "210px", "button", "Change/Set Data", "TEXT_SIZE=\"text-massive\";");
        }
        else if (DISPLAYMODE == 7) { // move element part 2
            let button_index = 20;
            vers_el("50%", "0", "p", "Move to where?");
            vers_el("40%", "0", "button", "->", "PAGEBUILDER.objects.splice(" + 0 + ", 0, STORED_OBJECT);DISPLAYMODE=0;gotopage(\"pagebuilder\");");
            for (let i = 0; i < PAGEBUILDER.objects.length - 1; i++) {
                vers_el("50%", button_index + "px", "h3", PAGEBUILDER.objects[i].text);
                vers_el("40%", (button_index + 20) + "px", "button", "->", "PAGEBUILDER.objects.splice(" + (i + 1) + ", 0, STORED_OBJECT);DISPLAYMODE=0;gotopage(\"pagebuilder\");");
                button_index += 45;
            }
            vers_el("50%", button_index + "px", "h3", PAGEBUILDER.objects[PAGEBUILDER.objects.length - 1].text);
            vers_el("40%", (button_index + 20) + "px", "button", "->", "PAGEBUILDER.objects.push(STORED_OBJECT);DISPLAYMODE=0;gotopage(\"pagebuilder\");");
        }
        else {
            vers_el("50%", "0", "p", "Unkown display mode!");
        }
        return;
    }
    if (page == "versions") {
        clear_page();
        create_text_big("Versions");
        create_text("Netcode: " + NETWORK.netcode);
        create_text("JSON Page: " + NETWORK.jsonvers);
        create_button("Return", "gotopage(\"devtools\");");
        return;
    }
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
        create_text("/ plugins");
        for (let i = 0; i < NETWORK.data.loaded_plugins.length; i++) {
            create_text(" + " + NETWORK.data.plugin_list[i].name);
        }
        create_text("-- " + NETWORK.data.plugin_list[NETWORK.data.loaded_plugins.length].name);
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
        create_text("All objects loaded. Waiting for main page...");
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
    }
}
