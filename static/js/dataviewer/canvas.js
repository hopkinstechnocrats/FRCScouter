/**
 * Creates a bar graph on the page.
 * For values with option, set to a value, just nil out
 * @param {String} width 
 * @param {String} height 
 * @param {*} options - Option<{y_lable: Option<String>, x_label: Option<String>, y_freq: Option<Number>}>
 * @param {*} dataset - [{label: Option<String>, value: Number},{..}]
 */
function create_bar_graph(width, height, options, dataset) {
    // REMINDER: CANVAS BUILDS TOP LEFT TO DOWN RIGHT
    // create a fake canvas and configure
    var ctm = document.getElementById("content");
    var node = document.createElement("canvas");
    if (width != 0 || height != 0) {
        node.setAttribute("width", width);
        node.setAttribute("height", height);
    }
    else {
        width = 40;
        height = 40;
    }
    node.setAttribute("id", "cvxtmp");
    // make the canvas real
    ctm.appendChild(node);
    // grab the now real canvas's context
    let el = document.getElementById("cvxtmp");
    let ctx = el.getContext('2d');
    // tmp clean background
    ctx.fillStyle = "rgb(35, 35, 35)";
    ctx.fillRect(0, 0, parseInt(width, 10), parseInt(height, 10));
    // tmp draw bars
    let space_per_w = parseInt(width);
    // 15px padding either side by default
    space_per_w -= 60;
    // for each
    space_per_w /= dataset.length;
    for (let i = 0; i < dataset.length; i++) {
        ctx.fillStyle = "rgb(255, 80, 80)";
        ctx.fillRect( // x, y are from top left
            (space_per_w * i) + (20 * (i + 1)), // x
            height, // y, we set to bottom
            space_per_w, // w
            -dataset[i].value // h, we make negative to make rect grow up
        );
        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.font = "bold 32px serif";
        if ((height - dataset[i].value + 32) < height - 32) {
            ctx.fillText(
                dataset[i].value + " '" + dataset[i].label + "'", // text
                (space_per_w * i) + (20 * (i + 1)), // x
                height - dataset[i].value + 32, // y
                space_per_w // max_width
            );
        }
        else {
            ctx.fillText(
                dataset[i].value + " '" + dataset[i].label + "'", // text
                (space_per_w * i) + (20 * (i + 1)), // x
                height - 32, // y
                space_per_w // max_width
            );
        }
    }
    // we're done so discard this
    el.setAttribute("id", "expired_handle");
}
