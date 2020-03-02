function load_data_base() {
    FIRST_PAGE = false;
    CONNECTION.send("l;2;0;");
    clear_page();
    create_text("Teams with matches:");
    if (HAS_DATA) {
        for (let i = 0; i < DATA_QUEUE.teams.length; i++) {
            create_button(DATA_QUEUE.teams[i].team_number, "team_statistics(" + DATA_QUEUE.teams[i].team_number + ");");
            create_break();
        }
    }
    create_break();
    create_break();
    create_button("Back to main page ⏪", "location.reload();");
    create_break();
    create_button("Update page 🔄", "CONNECTION.send(\"l;2;0\");load_data_base();");
    create_break();
    create_button("Pull JSON 👩🏻‍💻", "grab_json();");
    
}

function grab_json() {
    clear_page();
    create_text(JSON.stringify(DATA_QUEUE, null, 4));
}

function team_statistics(teamnum) {
    clear_page();
    create_text_massive("Data for team " + teamnum);
    let dispdata;
    let found_data = false;
    let ival = 0;
    for (let i = 0; i < DATA_QUEUE.teams.length; i++) {
        if (DATA_QUEUE.teams[i].team_number == parseInt(teamnum, 10)) {
            dispdata = DATA_QUEUE.teams[i];
            found_data = true;
            ival = i;
        }
    }
    if (found_data) {
        create_text("Team " + teamnum + " has participated in " + dispdata.matches.length + " matches.");
        for (let j = 0; j < dispdata.matches.length; j++) {
            create_button("Match " + dispdata.matches[j].match_number, "match_stats(" + ival + "," + j + ");");
            create_break();
        }
    }
    else {
        create_text("Data could not be found for team " + teamnum + ". Please try again later.");
    }
    create_button("Back ⏪", "load_data_base();");
}

function match_stats(i, j) {
    clear_page();
    let team = DATA_QUEUE.teams[i].team_number;
    let match = DATA_QUEUE.teams[i].matches[j].match_number;
    create_text_massive("Data for team " + team + " in match " + match);
    //create_text("raw: " + JSON.stringify(DATA_QUEUE.teams[i].matches[j], null, 4));
    let data = { autoshots: 0, autoshotsgood: 0 };
    for (let k = 0; k < DATA_QUEUE.teams[i].matches[j].packets.length; k++) {
        let this_packet = DATA_QUEUE.teams[i].matches[j].packets[k];
        if (this_packet.packet.type == "PreloadedCells") {
            data.preloaded = this_packet.packet.amount;
        }
        else if (this_packet.packet.type == "AutoLine") {
            data.crossline = this_packet.packet.amount;
        }
        else if (this_packet.packet.type == "AutoShot") {
            data.autoshots += 1;
            if (!this_packet.packet.missed) {
                data.autoshotsgood += 1;
            }
        }
        else {
            console.log("unregistered type: " + this_packet.packet.type);
        }
    }
    if (data.crossline) {
        create_text("Passed auto line. ✔️");
    }
    else {
        create_text("Did not pass auto line. ❌");
    }
    if (data.preloaded == 3) {
        create_text("3 preloaded cells! ✔️");
    }
    else if (data.preloaded == 0) {
        create_text("0 preloaded cells. ❌");
    }
    else {
        create_text(data.preloaded + " preloaded cells. 🆗");
    }
    create_text(data.autoshotsgood + "/" + data.autoshots + " shots made during autonomus.");
    create_break();
    create_button("Back ⏪", "team_statistics(" + team + ");");
}
