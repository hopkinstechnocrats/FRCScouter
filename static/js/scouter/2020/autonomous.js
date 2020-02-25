OFF_AUTO_LINE = false;

function g_2020_autonomous_base() {
    clear_page();
    create_text_massive("Autonomous 🤖")
    create_break();
    create_text("Moved off auto line: ⚙️");
    create_checkbox("g_2020_auto_line();", OFF_AUTO_LINE);
    create_break();
    create_break();
    create_button("Shot High ⬆️", "g_2020_map_phase(0);");
    create_break();
    create_button("Shot Low ⬇️", "g_2020_map_phase(1);");
    create_break();
    create_button("Missed High 💔", "g_2020_map_phase(2);");
    create_break();
    create_button("Missed Low 💔", "g_2020_map_phase(3);");
    create_break();
    create_break();
    create_button("Finish autonomous ⏭️", "g_2020_finish_auto();");
}

function g_2020_auto_line() {
    OFF_AUTO_LINE = !OFF_AUTO_LINE;
}

function g_2020_finish_auto() {
    // SEND CHECKBOX TO SERVER HERE
    if (OFF_AUTO_LINE) {
        CONNECTION.send("f;1;");
    }
    else {
        CONNECTION.send("f;0;");
    }
    g_2020_teleop_base();
}

let MAP_FROM;
let MAP_FIRST;

function g_2020_map_phase(from) {
    MAP_FROM = from;
    MAP_FIRST = false;
    clear_page();
    create_text("Select where the robot was");
    create_map(function(event) {
        if (MAP_FIRST) {
            MAP_FIRST = false;
        }
        else {
            let sucess;
            let hight;
            let position;
            let mousex = event.clientX;
            let mousey = event.clientY;
            if (mousex < 360/2) {
                // left side
                if (mousey < 480/3) {
                    // top third
                    position = 0;
                }
                else if (mousey < 480/3*2) {
                    // middle third
                    position = 1;
                }
                else {
                    // bottom third
                    position = 2;
                }
            }
            else {
                // right side
                if (mousey < 480/3) {
                    // top third
                    position = 3;
                }
                else if (mousey < 480/3*2) {
                    // middle third
                    position = 4;
                }
                else {
                    // bottom third
                    position = 5;
                }
            }
            switch (MAP_FROM) {
                case 0:
                    // yes, sucess = 0 IS in fact making the goal
                    sucess = 0;
                    hight = 1;
                    break;
                case 1:
                    sucess = 0;
                    hight = 0;
                    break;
                case 2:
                    sucess = 1;
                    hight = 1;
                    break;
                case 3:
                    sucess = 1;
                    hight = 0;
                    break;
                default:
                    console.log("Weird map position, this is a critical error (see auto: ~50)");
                    break;
            }
            // send server map data
            CONNECTION.send(
                "e;" + sucess + ";" + hight + ";" + position + ";"
            );
            g_2020_autonomous_base();
        }
    });
}
