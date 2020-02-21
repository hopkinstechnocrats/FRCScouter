/**
 * Creates a bar graph on the page.
 * For values with option, set to a value, just nil out
 * @param {String} width 
 * @param {String} height 
 * @param {*} dataset - [{label: Option<String>, value: Number},{..}]
 */
function create_bar_graph(width, height, dataset) {
    let good0 = 0;
    let good1 = 100;
    let good2 = 255;
    let bad0 = 255;
    let bad1 = 80;
    let bad2 = 80;
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
    let max_value = 0;
    for (let i = 0; i < dataset.length; i++) {
        if (dataset[i].value > max_value) {
            max_value = dataset[i].value;
        }
    }
    let space_per_h = height / max_value;
    for (let i = 0; i < dataset.length; i++) {
        ctx.fillStyle = "rgb(255, 80, 80)";
        let percent = dataset[i].value / max_value;
        let oposite = 1 - percent;
        let rvalue = Math.round(good0 * percent + bad0 * oposite);
        let gvalue = Math.round(good1 * percent + bad1 * oposite);
        let bvalue = Math.round(good2 * percent + bad2 * oposite);
        //console.log("rgbvalue" + rvalue + "|" + gvalue + "|" + bvalue);
        ctx.fillStyle = "rgb(" + rvalue + "," + gvalue + "," + bvalue + ")";
        ctx.fillRect( // x, y are from top left
            (space_per_w * i) + (20 * (i + 1)), // x
            height, // y, we set to bottom
            space_per_w, // w
            (-dataset[i].value)*space_per_h // h, we make negative to make rect grow up
        );
        ctx.fillStyle = "rgb(200, 200, 200)";
        ctx.font = "bold 32px serif";
        ctx.fillText(
            dataset[i].value, // text
            (space_per_w * i) + (20 * (i + 1)), // x
            (height - 32), // y
            space_per_w // max_width
        );
        ctx.fillText(
            "'" + dataset[i].label + "'", // text
            (space_per_w * i) + (20 * (i + 1)), // x
            (height - 3), // y
            space_per_w // max_width
        );
    }
    // we're done so discard this
    el.setAttribute("id", "expired_handle");
}
