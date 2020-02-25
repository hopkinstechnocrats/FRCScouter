/**
 * page.js contains functions used by content.js to quickly
 * create and distribute basic elements around the screen.
 */

 /**
 * Removes everything inside of the body tags of the page
 */
function clear_page() {
    let doc = document.getElementById("content");
    while (doc.firstChild) {
        doc.removeChild(doc.firstChild);
    }
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
 * @param {*} callback 
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
    context.fillStyle = "rgb(240, 35, 35)";
    context.fillRect(0, 0, 360, 50);
    context.fillStyle = "rgb(35, 35, 240)";
    context.fillRect(0, 430, 360, 50);
    context.fillStyle = "rgb(240, 160, 35)";
    context.fillRect(0, 480 / 4 * 2 - 5 - 50, 25, 25);
    context.fillRect(335, 480 / 4 * 3 - 5 - 50, 25, 25);
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
 * Creates a generic text node.
 * @param {String} text - Text to be used
 */
function create_text(text) {
    var ctx = document.getElementById("content");
    var node = document.createElement("p");
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    ctx.appendChild(node);
}

/**
 * Creates a generic text node, in a larger size
 * @param {String} text - Text to be used
 */
function create_text_big(text) {
    var ctx = document.getElementById("content");
    var node = document.createElement("h3");
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    ctx.appendChild(node);
}

/**
 * Creates a generic text node, in a massive size
 * @param {String} text - Text to be used
 */
function create_text_massive(text) {
    var ctx = document.getElementById("content");
    var node = document.createElement("h1");
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
    ctx.appendChild(node);
}

/**
 * Creates a generic text node, in a supermassive size
 * @param {String} text - Text to be used
 */
function create_text_clock(text) {
    var ctx = document.getElementById("content");
    var node = document.createElement("clock");
    var textnode = document.createTextNode(text);
    node.appendChild(textnode);
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
 * Creates a newline/break.
 */
function create_break() {
    var ctx = document.getElementById("content");
    var node = document.createElement("br");
    ctx.appendChild(node);
}
