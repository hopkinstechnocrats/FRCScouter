/**
 * Loads in the page for the base scouter application.
 */
function load_scouter_base() {
    clear_page();
    start_connection();
    create_text_massive("Select a game: ");
    check_games();
}

/**
 * Displays the avalable games. Does not clear the page.
 */
function check_games() {
    display_2019_game();
    create_break();
    create_break();
    display_2020_game();
}
