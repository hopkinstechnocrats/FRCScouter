CLIMB_REPOSITION = false;
CLIMB_BALENCED = false;
CLIMB_SUCEESS = false;

function g_2020_climb_base() {
    clear_page();
    create_text_massive("Climb");
    create_text("Can reposition while climbed");
    create_checkbox("g_2020_climb_reposition();", CLIMB_REPOSITION);
    create_text("Is balanced");
    create_checkbox("g_2020_climb_balenced();", CLIMB_BALENCED);
    create_text("Suceeded in climb");
    create_checkbox("g_2020_climb_sucsess();", CLIMB_SUCEESS);
    create_break();
    create_break();

    create_button("Game end 🔚", "g_2020_climb_to_end();");
}

function g_2020_climb_to_end() {
    // SEND SERVER CHECKBOXES HERE
    g_2020_post_base();
}

function g_2020_climb_reposition() {
    CLIMB_REPOSITION = !CLIMB_REPOSITION;
}

function g_2020_climb_balenced() {
    CLIMB_BALENCED = !CLIMB_BALENCED;
}

function g_2020_climb_sucsess() {
    CLIMB_SUCEESS = !CLIMB_SUCEESS;
}
