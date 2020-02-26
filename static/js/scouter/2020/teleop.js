function g_2020_teleop_base() {
    clear_page();
    create_text_massive("Teleop 🎮")
    create_break();
    create_button("Shot High ⬆️", "g_2020_map_live_phase(0);");
    create_break();
    create_button("Shot Low ⬇️", "g_2020_map_live_phase(1);");
    create_break();
    create_button("Missed High 💔", "g_2020_map_live_phase(2);");
    create_break();
    create_button("Missed Low 💔", "g_2020_map_live_phase(3);");
    create_break();
    create_break();
    create_button("Rotation Control 🔄", "CONNECTION.send(\"i;" + BOTNUM + ";\");");
    create_break();
    create_button("Position Control ♿", "CONNECTION.send(\"h;" + BOTNUM + ";\");");
    create_break();
    create_break();
    create_button("Attempted climb 🧗‍♀️", "g_2020_climb_confirm();");
    create_break();
    create_button("Game end 🔚", "g_2020_end_confirm();");
}

function g_2020_climb_confirm() {
    create_text_big("Are you SURE you want to enter climb phase? You will not be able to go back to teleop after this.");
    create_break();
    create_break();
    create_button("Yes! 👍", "g_2020_climb_base();");
    create_break();
    create_button("No! ⛔", "g_2020_teleop_base();");
}

function g_2020_end_confirm() {
    create_text_big("Are you SURE you want to end the game? You will not be able to go back to scouting after this.");
    create_break();
    create_break();
    create_button("Yes! 👍", "g_2020_post_base();");
    create_break();
    create_button("No! ⛔", "g_2020_teleop_base();");
}

function g_2020_map_live_phase(from) {
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
                if (mousey < 480/4) {
                    // top quarter
                    position = 0;
                }
                else if (mousey < 480/4*2) {
                    // middle quarter
                    position = 1;
                }
                else if (mousey < 480/4*3) {
                    // bottom middle quarter
                    position = 3;
                }
                else {
                    // bottom quarter
                    position = 4;
                }
            }
            else {
                // right side
                if (mousey < 480/4) {
                    // top quarter
                    position = 5;
                }
                else if (mousey < 480/4*2) {
                    // middle quarter
                    position = 6;
                }
                else if (mousey < 480/4*3) {
                    // bottom middle quarter
                    position = 7;
                }
                else {
                    // bottom quarter
                    position = 8;
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
                "g;" + BOTNUM + ";" + sucess + ";" + hight + ";" + position + ";"
            );
            g_2020_teleop_base();
        }
    });
    create_break();
    create_button("Back ⏪", "g_2020_teleop_base();");
}
