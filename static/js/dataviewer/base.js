function load_data_base() {
    FIRST_PAGE = false;
    CONNECTION.send("l;2;0;");
    clear_page();
    create_text_massive("Data Viewer");
    create_text_big("Try a View");
    create_break();
    create_button("Team Statistics", "team_statistics();");
    create_break();
    custom_team_number();
    create_break();
    create_button("Back to main page ⏪", "location.reload();");
}

function game_results() {
    clear_page();
    create_text_massive("Game Results 📊");
    create_text("This is incomplete. All the data is currently sample data. Waiting for game implimentation to finish this.");
    create_text_big("Mobile");
    create_button("Point totals", "dv_mobile_point_totals();");
    create_text_big("Desktop");
    create_button("Point totals", "dv_mobile_point_totals();");
    create_break();
    create_break();
    create_button("Done with results ⏪", "location.reload();");
}

function dv_mobile_point_totals() {
    clear_page();
    create_bar_graph(
        "360", "480", // x, y
        [{
            label: "team1",
            value: 10
        },
        {
            label: "team2",
            value: 15
        },
        {
            label: "team3",
            value: 20
        },
        {
            label: "team4",
            value: 25
        },
        {
            label: "team5",
            value: 35
        },
        {
            label: "team6",
            value: 37
        }]
    );
    create_break();
    create_button("Back ⏪", "game_results();");
}

function bar_test() {
    clear_page();
    create_bar_graph(
        "360", //x
        "480", //y
        [
            {
                label: "test",
                value: 29
            },
            {
                label: "1524",
                value: 15
            },
            {
                label: "very long label",
                value: 14
            }
        ]
    );
    create_break();
    create_button("Back ⏪", "load_data_base();");
}

function team_statistics(teamnum) {
    clear_page();
    create_text_big(teamnum);
    create_break();
    create_button("Back ⏪", "load_data_base();");
}

BOTNUM = "";

function custom_team_number() {
    clear_page();
    create_text_massive("Pick a Team To View Results");
    if (BOTNUM == "") {
        create_text_big("----");
    }
    else {
        create_text_big(BOTNUM);
    }
    create_button("7", "BOTNUM+=\"7\";custom_team_number();");
    create_button("8", "BOTNUM+=\"8\";custom_team_number();");
    create_button("9", "BOTNUM+=\"9\";custom_team_number();");
    create_break();
    create_button("4", "BOTNUM+=\"4\";custom_team_number();");
    create_button("5", "BOTNUM+=\"5\";custom_team_number();");
    create_button("6", "BOTNUM+=\"6\";custom_team_number();");
    create_break();
    create_button("1", "BOTNUM+=\"1\";custom_team_number();");
    create_button("2", "BOTNUM+=\"2\";custom_team_number();");
    create_button("3", "BOTNUM+=\"3\";custom_team_number();");
    create_break();
    create_button("⏪", "BOTNUM=BOTNUM.slice(0,-1);custom_team_number();");
    create_button("0", "BOTNUM+=\"0\";custom_team_number();")
    create_button("✅", "submit_team_num();");
    create_break();
    create_break();
    create_button("Back to game selection ⏪", "load_scouter_base();");
    EXIT_LOOP = false;
}

function submit_team_num() {
    if (BOTNUM == "") {
        g_2020_custom_team_number();
    }
    else {
        team_statistics(BOTNUM);
    }
}