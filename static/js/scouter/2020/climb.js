function g_2020_climb_base() {
    clear_page();
    create_text_massive("Climb");
    create_text("Can reposition while climbed");
    create_checkbox();
    create_text("Is balanced");
    create_checkbox();
    create_text("Suceeded in climb");
    create_checkbox();
    create_break();
    create_break();

    create_button("Game end 🔚", "g_2020_end_confirm();");
}