PLUG_PRIVATE = false;
PLUG = {};

function plug_setup(n, d) {
    clear_page();
    create_text_massive("Your Scouting App");
    create_text_big("Scouting App's Name");
    create_input("sa_name");
    create_text_big("Description");
    create_input("sa_desc");
    create_text("Private? (This only prevents your scouting app from showing up on the public list)");
    create_checkbox("PLUG_PRIVATE=!PLUG_PRIVATE;plug_setup()", PLUG_PRIVATE);
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
        plug_setup(false);
        return;
    }
    if (desc == "") {
        plug_setup(true, false);
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
    create_button("stuff here");
}
