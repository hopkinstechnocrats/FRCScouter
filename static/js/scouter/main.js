function load_page() {
    FIRST_PAGE = false;
    clear_page();
    create_text_massive("FRC Scouter 🔍🏃‍♀️");
    create_break();
    create_button("Connect as Scouter 🔌", "ON_GAMES=true;load_scouter_base();");
    create_break(2);
    create_button("View Collected Data 📊", "load_data_base();");
    create_break(2);
    create_text("Connected to server ✅");
    create_text("USID | " + USID);
    create_text("Network | " + NETCODE);
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
    display_network_games();
    create_break(2);
    setTimeout(load_scouter_base, 1000);
    // dislpay_2021_game().. ect
    
}

function display_network_games() {
    create_text_big("Network games");
    for (let i = 0; i < NETWORK_GAMES.length; i++) {
        create_button(NETWORK_GAMES[i].name);
        create_break();
    }
}
