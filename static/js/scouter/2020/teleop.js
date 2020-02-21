function g_2020_teleop_base() {
    clear_page();
    create_text("Again, I don't know the specifics on how the game works. This will all be figured out shortly.");
    create_button("Pick up ball");
    create_break();
    create_button("Shot on goal");
    create_break();
    create_break();
    create_button("Game end 🔚", "g_2020_end_confirm();");
}

function g_2020_end_confirm() {
    create_text_big("Are you SURE you want to end the game? You will not be able to go back to scouting after this.");
    create_break();
    create_break();
    create_button("Yes! 👍", "g_2020_game_end(0);");
    create_break();
    create_button("No! ⛔", "g_2020_teleop_base();");
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
