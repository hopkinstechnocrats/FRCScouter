function g_2020_teleop_base() {
    clear_page();
    create_text_massive("Teleop 🎮")
    create_break();
    create_button("Shot High ⬆️", "g_2020_map_live_phase();");
    create_break();
    create_button("Shot Low ⬇️", "g_2020_map_live_phase();");
    create_break();
    create_button("Missed 💔", "g_2020_map_live_phase();");
    create_break();
    create_break();
    create_button("Rotation Control 🔄");
    create_break();
    create_button("Position Control ♿");
    create_break();
    create_break();
    create_button("Attempted climb 🧗‍♀️", "g_2020_climb_confirm();");
    create_break();
    create_button("Game end 🔚", "g_2020_end_confirm();");
}

function g_2020_map_live_phase() {
    clear_page();
    create_text("map will be here, there will be ~6 sections to click for location");
    create_button("back to auto (temportary)", "g_2020_teleop_base();");
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
