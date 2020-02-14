/**
 * Loads in the page for the base scouter application.
 */
function load_scouter_base() {
    FIRST_PAGE = false;
    clear_page();
    create_text_massive("Select a game or option");
    check_games();
    create_button("Back to main page ⏪", "location.reload();");
}

/**
 * Displays the avalable games. Does not clear the page.
 */
function check_games() {
    display_2020_game();
    create_break();
    create_break();
    // dislpay_2021_game().. ect
}
