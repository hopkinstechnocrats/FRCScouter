/**
 * Loads in the page for the base scouter application.
 */
function load_scouter_base() {
    start_connection();
    console.log("This should be false: " + is_packet_avalable());
    create_text_massive("Select a game: ");
    check_games();
}

/**
 * Finds and displays the avalable games.
 */
function check_games() {
    display_2019_game();
    create_break();
    create_break();
    display_2020_game();
}
