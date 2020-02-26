// Is this secure? NO.
// Does it matter? NO.
function load_page() {
    FIRST_PAGE = false;
    clear_page();
    create_text_massive("FRC Scouter 🔍🏃‍♀️");
    create_break();
    create_button("Enter Admin Portal 🔌", "load_admin_base();");
    create_break();
    create_break();
    create_text("Connected to server ✅");
    create_text("USID | " + USID);
    create_text("Network | " + NETCODE);
    create_break();
    create_text("The fine print: Only one user can use the admin portal at a time. There is rudamentary security but you should change the password on first login.");
}

let BOTNUM = "";

function load_admin_base() {
    clear_page();
    create_text_massive("Enter password");
    if (BOTNUM == "") {
        create_text_big("----");
    }
    else {
        create_text_big(BOTNUM);
    }
    create_button("7", "BOTNUM+=\"7\";load_admin_base();");
    create_button("8", "BOTNUM+=\"8\";load_admin_base();");
    create_button("9", "BOTNUM+=\"9\";load_admin_base();");
    create_break();
    create_button("4", "BOTNUM+=\"4\";load_admin_base();");
    create_button("5", "BOTNUM+=\"5\";load_admin_base();");
    create_button("6", "BOTNUM+=\"6\";load_admin_base();");
    create_break();
    create_button("1", "BOTNUM+=\"1\";load_admin_base();");
    create_button("2", "BOTNUM+=\"2\";load_admin_base();");
    create_button("3", "BOTNUM+=\"3\";load_admin_base();");
    create_break();
    create_button("⏪", "BOTNUM=BOTNUM.slice(0,-1);load_admin_base();");
    create_button("0", "BOTNUM+=\"0\";load_admin_base();")
    create_button("✅", "submit_password();");
}

function submit_password() {
    clear_page();
    if (A_STATUS == 1) {
        portal();
    }
    else if (A_STATUS == 2) {
        invalid_pass();
    }
    else {
        CONNECTION.send("n;" + BOTNUM + ";");
        create_text_big("Logging in...");
        setTimeout(function() {submit_password()}, 500);
    }
}

function invalid_pass() {
    clear_page();
    create_text("Invalid password.");
    A_STATUS = -1;
    setTimeout(function() {load_page()}, 2000);
}

function portal() {
    clear_page();
    create_text_big("Admin portal")
    create_button("Start match now", "CONNECTION.send(\"q;" + A_TOKEN + ";1;0;\");");
    create_break();
    create_break();
    create_button("Change password", "change_password();");
    create_break();
    create_break();
    create_button("Reset server games", "CONNECTION.send(\"q;" + A_TOKEN + ";3;0\");");
}

function change_password() {
    clear_page();
    create_text_massive("Enter password");
    if (BOTNUM == "") {
        create_text_big("----");
    }
    else {
        create_text_big(BOTNUM);
    }
    create_button("7", "BOTNUM+=\"7\";change_password();");
    create_button("8", "BOTNUM+=\"8\";change_password();");
    create_button("9", "BOTNUM+=\"9\";change_password();");
    create_break();
    create_button("4", "BOTNUM+=\"4\";change_password();");
    create_button("5", "BOTNUM+=\"5\";change_password();");
    create_button("6", "BOTNUM+=\"6\";change_password();");
    create_break();
    create_button("1", "BOTNUM+=\"1\";change_password();");
    create_button("2", "BOTNUM+=\"2\";change_password();");
    create_button("3", "BOTNUM+=\"3\";change_password();");
    create_break();
    create_button("⏪", "BOTNUM=BOTNUM.slice(0,-1);change_password();");
    create_button("0", "BOTNUM+=\"0\";change_password();")
    create_button("✅", "confirm_change();");
}

function confirm_change() {
    CONNECTION.send("q;" + A_TOKEN + ";2;" + BOTNUM + ";");
    portal();
}