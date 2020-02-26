function load_data_base() {
    FIRST_PAGE = false;
    CONNECTION.send("l;2;0;");
    clear_page();
    create_text("json: " + JSON.stringify(DATA_QUEUE, null, 4));
    create_break();
    custom_team_number();
    create_break();
    create_break();
    create_button("Back to main page ⏪", "location.reload();");
    create_break();
    create_button("Update page 🔄", "CONNECTION.send(\"l;2;0\");load_data_base();");
}

function team_statistics(teamnum) {
    clear_page();
    create_text_massive("Data for team " + teamnum);
    create_break();
    let dispdata;
    let found_data = false;
    let ival = 0;
    for (let i = 0; i < DATA_QUEUE.teams.length; i++) {
        if (DATA_QUEUE.teams[i].team_number == parseInt(TEAMNUM, 10)) {
            dispdata = DATA_QUEUE.teams[i];
            found_data = true;
            ival = i;
        }
    }
    if (found_data) {
        create_text("raw: " + JSON.stringify(dispdata, null, 4));
        for (let j = 0; j < dispdata.matches.length; j++) {
            create_button("Match [" + dispdata.matches[j].match_number + "]", "match_stats(" + ival + "," + j + ");");
            create_break();
        }
    }
    else {
        create_text("Data could not be found for team " + TEAMNUM + ". Please try again later.");
    }
    create_button("Back ⏪", "load_data_base();");
}

function match_stats(i, j) {
    clear_page();
    let team = DATA_QUEUE.teams[i].team_number;
    let match = DATA_QUEUE.teams[i].matches[j].match_number;
    create_text_massive("Data for team " + team + " in match " + match);
    create_text("raw: " + JSON.stringify(DATA_QUEUE.teams[i].matches[j], null, 4));
    create_button("Back ⏪", "team_statistics(" + team + ");");
}

TEAMNUM = "";

function custom_team_number() {
    create_text_massive("Pick a Team To View Results");
    if (TEAMNUM == "") {
        create_text_big("----");
    }
    else {
        create_text_big(TEAMNUM);
    }
    create_button("7", "TEAMNUM+=\"7\";load_data_base();");
    create_button("8", "TEAMNUM+=\"8\";load_data_base();");
    create_button("9", "TEAMNUM+=\"9\";load_data_base();");
    create_break();
    create_button("4", "TEAMNUM+=\"4\";load_data_base();");
    create_button("5", "TEAMNUM+=\"5\";load_data_base();");
    create_button("6", "TEAMNUM+=\"6\";load_data_base();");
    create_break();
    create_button("1", "TEAMNUM+=\"1\";load_data_base();");
    create_button("2", "TEAMNUM+=\"2\";load_data_base();");
    create_button("3", "TEAMNUM+=\"3\";load_data_base();");
    create_break();
    create_button("⏪", "TEAMNUM=TEAMNUM.slice(0,-1);load_data_base();");
    create_button("0", "TEAMNUM+=\"0\";load_data_base();")
    create_button("✅", "submit_team_num();");
    EXIT_LOOP = false;
}

function submit_team_num() {
    if (TEAMNUM == "" || TEAMNUM.length > 10) {
        load_data_base();
    }
    else {
        team_statistics(TEAMNUM);
    }
}