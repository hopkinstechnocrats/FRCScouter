function load_data_base() {
    FIRST_PAGE = false;
    clear_page();
    create_text_massive("Data Viewer Tests");
    create_text_big("Try a View");
    create_break();
    create_button("Test: Basic Bar", "bar_test();");
    create_break();
    create_break();
    create_button("Back to main page ⏪", "location.reload();");
}

function bar_test() {
    clear_page();
    create_bar_graph(
        "360", //x
        "500", //y
        {
            y_label: "",
            x_label: "",
            y_freq: 0
        },
        [
            {
                label: "label",
                value: 230
            },
            {
                label: "very long label",
                value: 15
            },
        ]
    );
    create_break();
    create_button("Back ⏪", "load_data_base();");
}
