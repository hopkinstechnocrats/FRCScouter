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
    create_button("0", "BOTNUM+=\"0\";g_2020_custom_team_number();")
    create_button("✅", "g_2020_submit_team_num();");
    create_break();
    create_break();
    create_button("Back to game selection ⏪", "load_scouter_base();");
    EXIT_LOOP = false;
}

function g_2020_submit_team_num() {
    if (BOTNUM == "") {
        g_2020_custom_team_number();
    }
    else {
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
}

EXIT_LOOP = false;

function g_2020_waiting_phase() {
    if (SCOUTERS_READY) {
        g_2020_preloaded_cells();
    }
    else if (EXIT_LOOP) {
        g_2020_custom_team_number();
    }
    else {
        clear_page();
        create_text_massive("Waiting for Scouters...");
        create_text_big("Currently scouting: Team " + BOTNUM);
        if (RUNNING_GAME == -1) {
            create_text_big("Waiting for match number ?");
        }
        else {
            create_text_big("Waiting for match number " + (RUNNING_GAME + 1));
        }
        create_break();
        for (let i = 0; i < SCOUTERS_INFO.length; i++) {
            create_break();
            create_text("Team " + SCOUTERS_INFO[i].team + " [" + SCOUTERS_INFO[i].amount + " people]");
        }
        create_break();
        create_break();
        create_button("Leave queue ❌", "CONNECTION.send(raw_from_packets([{packet_type:12,usid:USID}]));EXIT_LOOP=true;");
        create_break();
        create_button("Join game in progress ☠️", "CONNECTION.send(raw_from_packets([{packet_type:12,usid:USID}]));SCOUTERS_READY=true;");
        CONNECTION.send(
            raw_from_packets(
                [
                    { packet_type: 9 }
                ]
            )
        );
        CONNECTION.send(
            raw_from_packets(
                [
                    { packet_type: 10 }
                ]
            )
        )
        setTimeout(g_2020_waiting_phase, 500);
    }
}

function g_2020_preloaded_cells() {
    clear_page();
    create_text_massive("Amount of preloaded Power Cells ⚽");
    create_break();
    create_button("3!", "CONNECTION.send(\"d;3;\");g_2020_autonomous_base();");
    create_break();
    create_button("2", "CONNECTION.send(\"d;2;\");g_2020_autonomous_base();");
    create_break();
    create_button("1", "CONNECTION.send(\"d;1;\");g_2020_autonomous_base();");
    create_break();
    create_button("0...", "CONNECTION.send(\"d;0;\");g_2020_autonomous_base();");
}
