function display_2019_sandstorm() {
    clear_page();
    create_text_massive("Sandstorm Starting Position 🏜️");
    create_break();
    create_text("Level 1");
    create_button("Left", "_2019_starting_position(1);");
    create_button("Center", "_2019_starting_position(2);");
    create_button("Right", "_2019_starting_position(3);");
    create_break();
    create_text("Level 2");
    create_button("Left", "_2019_starting_position(4);");
    create_button_spacer("Center");
    create_button("Right", "_2019_starting_position(5);");
}

// TODO: send what packets are needed to backend
function _2019_starting_position(position) {
    switch (position) {
        case 1: // left 1
            break;
        case 2: // center 1
            break;
        case 3: // right 1
            break;
        case 4: // left 2
            break;
        case 5: // right 2
            break;
        default:
            console.error("STARTING POSITION IN 2019 GAME INVALID");
            break;
    }
    display_2019_auto_line();
}

function display_2019_auto_line() {
    clear_page();
    create_button("Crossed Autonomus Line");
    create_break();
    create_button("🔙 Back to Starting Position");
    create_button("End Sandstorm ⏩");
}
