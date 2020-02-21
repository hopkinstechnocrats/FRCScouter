function display_2020_game() {
    create_text_big("2020 - Infinite Recharge 🔋");
    create_break();
    create_button("Confirm Scouting ✅", "g_2020_custom_team_number();");
}

BOTNUM = "";

function g_2020_custom_team_number() {
    clear_page();
    create_text_massive("Pick a Robot to Scout");
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
    create_button("✅", "g_2020_submit_team_num();");
    create_break();
    create_break();
    create_button("Back to game selection ⏪", "load_scouter_base();");
}

function g_2020_submit_team_num() {
    CONNECTION.send(
        raw_from_packets(
            [
                {
                    packet_type: 6,
                    usid: USID,
                    team_number: BOTNUM
                }
            ]
        )
    );
    g_2020_waiting_phase();
}

function g_2020_waiting_phase() {
    if (SCOUTERS_READY) {
        g_2020_autonomous_base();
    }
    else {
        clear_page();
        create_text_massive("Waiting for Scouters...");
        create_break();
        for (let i = 0; i < SCOUTERS_INFO.length; i++) {
            create_break();
            create_text("Team " + SCOUTERS_INFO[i].team + " [" + SCOUTERS_INFO[i].amount + " people]");
        }
        setTimeout(g_2020_waiting_phase, 500);
    }
}
