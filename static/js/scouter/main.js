function load_page() {
    clear_page();
    create_text_massive("FRC Scouter 🔍🏃‍♀️");
    create_break();
    create_button("Connect as Scouter 🔌", "ON_GAMES=true;load_scouter_base();");
    create_break(2);
    // TODO: reenable when dataviewer is remade
    // create_button("View Collected Data 📊", "load_data_base();");
    create_break(10);
    create_homepage_button()
    create_links();
}

/**
 * Loads in the page for the base scouter application.
 */
function load_scouter_base() {
    if (ON_GAMES) {
        FIRST_PAGE = false;
        clear_page();
        create_text_massive("Select a game or option");
        check_games();
        create_button("Back to main page ⏪", "location.reload();");
    }
}

ON_GAMES = true;

/**
 * Displays the avalable games. Does not clear the page.
 */
function check_games() {
    display_2020_game();
    create_break(2);
    // dislpay_2021_game().. ect
    setTimeout(load_scouter_base, 1000);
}
