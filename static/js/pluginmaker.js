function plug_setup(n, d, n2, d2) {
    // left off here
    create_text("Private? (This only prevents your scouting app from showing up on the public list)");
    create_checkbox("PLUG_PRIVATE=!PLUG_PRIVATE;plug_setup(true,true,document.getElementById(\"sa_name\").value,document.getElementById(\"sa_desc\").value)", PLUG_PRIVATE);
    create_break();
    create_break();
    if (n == false) {
        create_text("You must have a name.");
    }
    if (d == false) {
        create_text("You must have a description.");
    }
    create_button("Continue!", "plug_check_params();");
}

function plug_check_params() {
    let name = document.getElementById("sa_name").value;
    let desc = document.getElementById("sa_desc").value;
    if (name == "") {
        plug_setup(false, true, name, desc);
        return;
    }
    if (desc == "") {
        plug_setup(true, false, name, desc);
        return;
    }
    PLUG.name = name;
    PLUG.desc = desc;
    plug_home();
}

function plug_home() {
    clear_page();
    create_text_massive(PLUG.name);
    create_text(PLUG.desc);
    create_break();
    create_button("Edit a page", "plug_page();");
    create_break();
    create_button("Change your look");
    create_break(2);
    create_button("Done!");
}

function plug_page() {
    clear_page();
    create_text_massive(PLUG.name);
    create_text(PLUG.desc);
    create_break();
    create_button("Autonomous Page");
    create_break();
    create_button("Teleop Page");
}
