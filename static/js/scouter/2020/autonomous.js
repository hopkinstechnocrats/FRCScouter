function g_2020_autonomous_base() {
    clear_page();
    create_text_massive("Autonomus 🤖")
    create_break();
    create_text("Moved off auto line: ⚙️");
    create_checkbox();
    create_break();
    create_break();
    create_button("Shot High ⬆️", "g_2020_map_phase();");
    create_break();
    create_button("Shot Low ⬇️", "g_2020_map_phase();");
    create_break();
    create_button("Missed 💔", "g_2020_map_phase();");
    create_break();
    create_break();
    create_button("Finish autonomous ⏭️", "g_2020_teleop_base();");
}

function g_2020_map_phase() {
    clear_page();
    create_text("map will be here, there will be ~6 sections to click for location");
    create_button("back to auto (temportary)", "g_2020_autonomous_base();");
}
