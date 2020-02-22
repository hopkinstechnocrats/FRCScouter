DID_DEFEND = false;
DEALT_DEFEND = false;

function g_2020_post_base() {
    clear_page();
    create_text_massive("End of game questions");
    create_text("Has done control panel");
    create_checkbox();
    create_text("Had fouls");
    create_checkbox();
    create_text("Can do defense");
    create_checkbox("g_2020_post_toggle_did_def(self);");
    create_text("Defence involved");
    create_checkbox("g_2020_post_toggle_deal_def(self);");
    if (DEALT_DEFEND) {
        create_text("Dealing with Defense (low <-> high)");
        create_slider();
    }
    if (DID_DEFEND) {
        create_text("Ability to Defend opponents (low <-> high)");
        create_slider();
    }
    create_break();
    create_button("Done!", "g_2020_game_end(0);");
}

function g_2020_post_toggle_did_def(self) {
    console.log(self + "| self");
    self.checked = true;
    DID_DEFEND = !DID_DEFEND;
    g_2020_post_base();
}

function g_2020_post_toggle_deal_def() {
    DEALT_DEFEND = !DEALT_DEFEND;
    g_2020_post_base();
}

function g_2020_game_end(clock) {
    if (clock == 12) {
        clock = 0;
    }
    clear_page();
    create_text_big("Waiting for results... ")
    switch (clock) {
        case 0:
            create_text_massive("🕛");
            break;
        case 1:
            create_text_massive("🕐");
            break;
        case 2:
            create_text_massive("🕑");
            break;
        case 3:
            create_text_massive("🕒");
            break;
        case 4:
            create_text_massive("🕓");
            break;
        case 5:
            create_text_massive("🕔");
            break;
        case 6:
            create_text_massive("🕕");
            break;
        case 7:
            create_text_massive("🕖");
            break;
        case 8:
            create_text_massive("🕗");
            break;
        case 9:
            create_text_massive("🕘");
            break;
        case 10:
            create_text_massive("🕙");
            break;
        case 11:
            create_text_massive("🕚");
            break;
        default:
            create_text_massive("❓");
            break;
    }
    setTimeout(g_2020_game_end, 1000, clock + 1);
}