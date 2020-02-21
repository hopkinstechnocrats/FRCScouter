function load_data_base() {
    FIRST_PAGE = false;
    clear_page();
    create_text_massive("Data Viewer Tests");
    create_text_big("Try a View");
    create_break();
    create_button("Test: Basic Bar", "bar_test();");
    create_break();
    create_button("Demo: Game Results", "game_results();");
    create_break();
    create_break();
    create_button("Back to main page ⏪", "location.reload();");
}

function game_results() {
    clear_page();
    create_text_massive("Game Results 📊");
    create_text("This is incomplete. All the data is currently sample data. Waiting for game implimentation to finish this.");
    create_text_big("Mobile");
    create_button("Point totals", "dv_mobile_point_totals();");
    create_text_big("Desktop");
    create_button("Point totals", "dv_mobile_point_totals();");
    create_break();
    create_break();
    create_button("Done with results ⏪", "location.reload();");
}

function dv_mobile_point_totals() {
    clear_page();
    create_bar_graph(
        "360", "480", // x, y
        [{
            label: "team1",
            value: 10
        },
        {
            label: "team2",
            value: 15
        },
        {
            label: "team3",
            value: 20
        },
        {
            label: "team4",
            value: 25
        },
        {
            label: "team5",
            value: 35
        },
        {
            label: "team6",
            value: 37
        }]
    );
    create_break();
    create_button("Back ⏪", "game_results();");
}

function bar_test() {
    clear_page();
    create_bar_graph(
        "360", //x
        "480", //y
        [
            {
                label: "test",
                value: 29
            },
            {
                label: "1524",
                value: 15
            },
            {
                label: "very long label",
                value: 14
            }
        ]
    );
    create_break();
    create_button("Back ⏪", "load_data_base();");
}
