DID_DEFEND = false;
DEALT_DEFEND = false;
HAD_FOULS = false;
DID_CONTROL = false;
SLIDER_1_VALUE = "5";
SLIDER_2_VALUE = "5";

function g_2020_post_base() {
    clear_page();
    create_text_massive("End of game questions");
    create_text("Has done control panel");
    create_checkbox("g_2020_post_control();", DID_CONTROL);
    create_text("Had fouls");
    create_checkbox("g_2020_post_fouls();", HAD_FOULS);
    create_text("Can do defense");
    create_checkbox("g_2020_post_toggle_did_def();", DID_DEFEND);
    if (DID_DEFEND) {
        create_text("Ability to Defend opponents (low <-> high)");
        create_slider("g_2020_did_def(this);", SLIDER_1_VALUE);
    }
    create_text("Defence involved");
    create_checkbox("g_2020_post_toggle_deal_def();", DEALT_DEFEND);
    if (DEALT_DEFEND) {
        create_text("Dealing with Defense (low <-> high)");
        create_slider("g_2020_deal_def(this);", SLIDER_2_VALUE);
    }
    create_break();
    create_button("Done!", "g_2020_game_end(0);");
}

function g_2020_did_def(self) {
    SLIDER_1_VALUE = self.value;
}

function g_2020_deal_def(self) {
    SLIDER_2_VALUE = self.value;
}

function g_2020_post_control() {
    DID_CONTROL = !DID_CONTROL;
}

function g_2020_post_fouls() {
    HAD_FOULS = !HAD_FOULS;
}

function g_2020_post_toggle_did_def() {
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
            create_text_clock("🕛");
            break;
        case 1:
            create_text_clock("🕐");
            break;
        case 2:
            create_text_clock("🕑");
            break;
        case 3:
            create_text_clock("🕒");
            break;
        case 4:
            create_text_clock("🕓");
            break;
        case 5:
            create_text_clock("🕔");
            break;
        case 6:
            create_text_clock("🕕");
            break;
        case 7:
            create_text_clock("🕖");
            break;
        case 8:
            create_text_clock("🕗");
            break;
        case 9:
            create_text_clock("🕘");
            break;
        case 10:
            create_text_clock("🕙");
            break;
        case 11:
            create_text_clock("🕚");
            break;
        default:
            create_text_clock("❓");
            break;
    }
    setTimeout(g_2020_game_end, 1000, clock + 1);
}