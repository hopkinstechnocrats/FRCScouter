function display_2020_game() {
    create_text_big("2020 - Infinite Recharge 🔋");
    create_break();
    create_button("Confirm Scouting ✅", "ON_GAMES=false;g_2020_custom_match_number();");
}

MATCHNUM = "";

function g_2020_custom_match_number() {
    clear_page();
    create_text_massive("Enter a match number");
    if (MATCHNUM == "") {
        create_text_big("--");
    }
    else {
        create_text_big(MATCHNUM);
    }
    create_button("7", "MATCHNUM+=\"7\";g_2020_custom_match_number();");
    create_button("8", "MATCHNUM+=\"8\";g_2020_custom_match_number();");
    create_button("9", "MATCHNUM+=\"9\";g_2020_custom_match_number();");
    create_break();
    create_button("4", "MATCHNUM+=\"4\";g_2020_custom_match_number();");
    create_button("5", "MATCHNUM+=\"5\";g_2020_custom_match_number();");
    create_button("6", "MATCHNUM+=\"6\";g_2020_custom_match_number();");
    create_break();
    create_button("1", "MATCHNUM+=\"1\";g_2020_custom_match_number();");
    create_button("2", "MATCHNUM+=\"2\";g_2020_custom_match_number();");
    create_button("3", "MATCHNUM+=\"3\";g_2020_custom_match_number();");
    create_break();
    create_button("⏪", "MATCHNUM=MATCHNUM.slice(0,-1);g_2020_custom_match_number();");
    create_button("0", "MATCHNUM+=\"0\";g_2020_custom_match_number();")
    create_button("✅", "g_2020_submit_match_num();");
    create_break(2);
    create_button("Back to game selection ⏪", "load_scouter_base();");
}

function g_2020_submit_match_num() {
    // eventually this will pull the live teams, if avalable, for the specified match.
    // for now, forward to team selection.
    if (MATCHNUM == "" || MATCHNUM.length > 2) {
        g_2020_custom_match_number();
    }
    else {
        g_2020_custom_team_number();
    }
}

BOTNUM = "";

function g_2020_custom_team_number() {
    clear_page();
    create_text_massive("Pick a robot to scout for match " + MATCHNUM);
    if (BOTNUM == "") {
        create_text_big("----");
    }
    else {
        create_text_big(BOTNUM);
    }
    create_button("7", "BOTNUM+=\"7\";g_2020_custom_team_number();");
    create_button("8", "BOTNUM+=\"8\";g_2020_custom_team_number();");
    create_button("9", "BOTNUM+=\"9\";g_2020_custom_team_number();");
    create_break();
    create_button("4", "BOTNUM+=\"4\";g_2020_custom_team_number();");
    create_button("5", "BOTNUM+=\"5\";g_2020_custom_team_number();");
    create_button("6", "BOTNUM+=\"6\";g_2020_custom_team_number();");
    create_break();
    create_button("1", "BOTNUM+=\"1\";g_2020_custom_team_number();");
    create_button("2", "BOTNUM+=\"2\";g_2020_custom_team_number();");
    create_button("3", "BOTNUM+=\"3\";g_2020_custom_team_number();");
    create_break();
    create_button("⏪", "BOTNUM=BOTNUM.slice(0,-1);g_2020_custom_team_number();");
    create_button("0", "BOTNUM+=\"0\";g_2020_custom_team_number();")
    create_button("✅", "g_2020_submit_team_num();");
    create_break(2);
    create_button("Back to match selection ⏪", "g_2020_custom_match_number();");
}

function g_2020_submit_team_num() {
    if (BOTNUM == "" || BOTNUM.length > 10) {
        g_2020_custom_team_number();
    }
    else {
        g_2020_preloaded_cells();
    }
}

function g_2020_preloaded_cells() {
    clear_page();
    create_text_massive("Amount of preloaded Power Cells ⚽");
    create_break();
    create_button("3!", "CONNECTION.send(\"d;" + BOTNUM + ";" + MATCHNUM + ";3;\");g_2020_autonomous_base();");
    create_break();
    create_button("2", "CONNECTION.send(\"d;" + BOTNUM + ";" + MATCHNUM + ";2;\");g_2020_autonomous_base();");
    create_break();
    create_button("1", "CONNECTION.send(\"d;" + BOTNUM + ";" + MATCHNUM + ";1;\");g_2020_autonomous_base();");
    create_break();
    create_button("0...", "CONNECTION.send(\"d;" + BOTNUM + ";" + MATCHNUM + ";0;\");g_2020_autonomous_base();");
    create_break(2);
    create_button("Back to robot selection ⏪", "g_2020_custom_team_number();");
    create_text("Scouting team " + BOTNUM + " for match " + MATCHNUM);
}
