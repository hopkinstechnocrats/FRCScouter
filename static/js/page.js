/**
 * page.js contains functions used by content.js to quickly
 * create and distribute basic elements around the screen.
 */


function read_page(json) {
    if (NETWORK.jsonvers != json.version) {
        console.error("Unable to load page: JSON Page version " + json.version + " incompatible with local version " + NETWORK.jsonvers + ".");
        return;
    }
    if (json.format == "objects-decending") {
        for (let i = 0; i < json.objects.length; i++) {
            let obj = json.objects[i];
            switch (obj.object_type) {
                case "text":
                    create_vers("p", obj.text);
                    break;
                case "text-big":
                    create_vers("h3", obj.text);
                    break;
                case "text-massive":
                    create_vers("h1", obj.text)
                    break;
                case "text-clock":
                    create_vers("clock", obj.text)
                    break;
                case "break":
                    create_break(obj.amount);
                    break;
                case "button":
                    create_button(obj.text, evaluate_action(obj.action));
                    break;
                case "input":
                    create_input(obj.id, evaluate_action(obj.text_action));
                    break;
                case "variable":
                    create_text(get_env(obj.variable));
                    break;
                default:
                    console.error("Unkown object type parsing JSON Page: " + obj.object_type);
                    break;
            }
        }
    }
    else if (json.format == "spawn") {
        let page_name = evaluate_action(json.page_loc);
        if (page_name != "") {
            read_page(get_env(page_name))
        }
        for (let i = 0; i < json.vers_objs.length; i++) {
            let obj = json.objects[i];
            vers_el(obj.loc_left, obj.loc_top, obj.el_type, obj.el_text, obj.el_onclick, obj.el_id);
        }
    }
    else {
        console.error("Unable to load page: JSON Page format unkown: " + json.format);
        return;
    }
}

// deals with jsonpage actions by running or generating js code
function evaluate_action(action) {
    if (action == undefined) {
        return "";
    }
    switch (action.type) {
        case undefined:
            return "";
        case "redirect":
            return "gotopage(\"" + action.name + "\");" + evaluate_action(action.sub_action);
        case "set-var":
            return "set_env(\"" + action.variable + "\"," + evaluate_action(action.value) + ");" + evaluate_action(action.sub_action);
        case "modify-var":
            return "set_env(\"" + action.variable + "\",get_env(\"" + action.variable + "\")+" + action.value + ");" + evaluate_action(action.sub_action);
        case "set-var-imm":
            set_env(action.variable, evaluate_action(action.value));
            return evaluate_action(action.sub_action);
        case "modify-var-imm":
            console.log("modify now");
            set_env(action.variable, get_env(action.variable) + action.value);
            return evaluate_action(action.sub_action);
        case "get-var":
            get_env(action.variable);
            return evaluate_action(action.sub_action);
        case "get-page":
            return "document.getElementById(\"" + action.el_id + "\").value";
        case "get-page-imm":
            evaluate_action(action.sub_action);
            document.getElementById(action.el_id).value;
            return evaluate_action(action.sub_action);
        case "data-imm":
            evaluate_action(action.sub_action);
            return action.data;
        default:
            console.error("evaluate action could not find " + action + "!");
            console.error(action);
            break;
    }
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

function vers_el(loc_left, loc_top, el_type, el_text, el_onclick, el_id) {
    var ctx = document.getElementById("content");
    var node = document.createElement(el_type);
    var textnode = document.createTextNode(el_text);
    node.appendChild(textnode);
    node.setAttribute("onclick", el_onclick);
    node.classList.add("vers_el");
    node.style.left = loc_left;
    node.style.top = loc_top;
    node.id = el_id;
    ctx.appendChild(node);
}

function create_input(id, content) {
    var ctx = document.getElementById("content");
    var node = document.createElement("input");
    node.id = id;
    if (content != undefined) {
        node.value = content;
    }
    ctx.appendChild(node);
}

/**
 * Creates a button that calls a function when pressed.
 * @param {String} text - Text inside of the button
 * @param {Function} callback - Function called on a click
 */
function create_button(text, callback) {
    var ctx = document.getElementById("content");
    var node = document.createElement("button");
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    node.setAttribute("onclick", callback);
    ctx.appendChild(node);
}


NUMPADRESULT = "";

/**
 * Creates a numpad that generates NUMPADRESULT when used
 * @param {Function} pagename - Function on any button press
 * @param {Function} confirmpage - Function when the checkmark button is clicked
 */
function create_numpad(pagename, confirmpage) {
    if (NUMPADRESULT == "") {
        create_text_big("----");
    }
    else {
        create_text_big(NUMPADRESULT);
    }
    create_button("7", "NUMPADRESULT+=\"7\";" + pagename);
    create_button("8", "NUMPADRESULT+=\"8\";" + pagename);
    create_button("9", "NUMPADRESULT+=\"9\";" + pagename);
    create_break();
    create_button("4", "NUMPADRESULT+=\"4\";" + pagename);
    create_button("5", "NUMPADRESULT+=\"5\";" + pagename);
    create_button("6", "NUMPADRESULT+=\"6\";" + pagename);
    create_break();
    create_button("1", "NUMPADRESULT+=\"1\";" + pagename);
    create_button("2", "NUMPADRESULT+=\"2\";" + pagename);
    create_button("3", "NUMPADRESULT+=\"3\";" + pagename);
    create_break();
    create_button("⏪", "NUMPADRESULT=NUMPADRESULT.slice(0,-1);" + pagename);
    create_button("0", "NUMPADRESULT+=\"0\";" + pagename)
    create_button("✅", confirmpage);
}

/**
 * Creates a checkbox that calls a callback when it is clicked
 * @param {Function} callback - Function called on a click
 * @param {Boolean} state - Wether the box is checked or not
 */
function create_checkbox(callback, state) {
    var ctx = document.getElementById("content");
    var node = document.createElement("input");
    node.setAttribute("type", "checkbox");
    node.setAttribute("onclick", callback);
    node.checked = state;
    ctx.appendChild(node);
}

/**
 * pretend this works well please
 * @param {Function} callback - Onclick callback, actual function pls
 */
function create_map(callback) {
    var ctx = document.getElementById("content");
    var node = document.createElement("canvas");
    node.setAttribute("width", "360");
    node.setAttribute("height", "480");
    node.addEventListener("mousedown", callback);
    node.addEventListener("touchdown", callback);
    ctx.appendChild(node);
    let context = node.getContext('2d');
    // red aliance goal
    context.fillStyle = "rgb(240, 35, 35)";
    context.fillRect(360 / 2, 0, 360 / 2, 50);
    // blue alliance goal
    context.fillStyle = "rgb(35, 35, 240)";
    context.fillRect(0, 430, 360 / 2, 50);
    context.font = "bold 32px serif";
    context.fillStyle = "rgb(35, 35, 35)";
    context.fillText("Blue Goal", 0, 450, 360 / 2);
    // control stations
    context.fillStyle = "rgb(240, 160, 35)";
    // red side control
    context.fillRect(0, 480 / 4 * 2 - 5 - 50, 25, 25);
    // blue side control
    context.fillRect(335, 480 / 4 * 2 + 5 + 25, 25, 25);
    // section lines
    context.fillStyle = "rgb(35, 35, 35)";
    context.fillRect(360 / 2 - 5, 0, 10, 480);
    context.fillRect(0, 480 / 4 - 5, 360, 10);
    context.fillRect(0, 480 / 4 * 2 - 5, 360, 10);
    context.fillRect(0, 480 / 4 * 3 - 5, 360, 10);
}

/**
 * Creates a slider that calls a callback when it is changed
 * @param {Function} callback 
 * @param {String} value
 */
function create_slider(callback, value) {
    var ctx = document.getElementById("content");
    var node = document.createElement("input");
    node.setAttribute("oninput", callback);
    node.setAttribute("type", "range");
    node.setAttribute("min", "1");
    node.setAttribute("max", "10");
    node.value = value;
    ctx.appendChild(node);
}

/**
 * Creates a button without a event on click and grayed out styling.
 * @param {String} text - Text inside of the button
 */
function create_button_invalid(text) {
    var ctx = document.getElementById("content");
    var node = document.createElement("button");
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    node.classList.add("invalid-btn");
    ctx.appendChild(node);
}

/**
 * Creates a button that is invisible to be used as padding
 * @param {String} text - Text inside of the button
 */
function create_button_spacer(text) {
    var ctx = document.getElementById("content");
    var node = document.createElement("button");
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    node.classList.add("invis-btn");
    ctx.appendChild(node);
}

/**
 * Creates a meter with a value of amnt/100.
 * @param {Number} amnt - Amount out of 100 to fill the meter
 */ 
function create_meter(amnt) {
    var ctx = document.getElementById("content");
    var node = document.createElement("meter");
    node.max = 100;
    node.value = amnt;
    ctx.appendChild(node);
}

/**
 * Creates a newlines.
 * @param {Number} amount - Optional number of lines to create
 */
function create_break(amount) {
    var ctx = document.getElementById("content");
    var node = document.createElement("br");
    ctx.appendChild(node);
    if (amount > 1) {
        create_break(amount - 1);
    }
}

function create_vers(eltype, text) {
    var ctx = document.getElementById("content");
    var node = document.createElement(eltype);
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    ctx.appendChild(node);
}
