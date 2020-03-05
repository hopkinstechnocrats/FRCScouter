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
    create_numpad("load_admin_base();", "submit_password();");
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
        CONNECTION.send("n;" + NUMPADRESULT + ";");
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
    create_text_big("Admin portal");
    create_button("Change password", "change_password();");
    create_break();
    create_break();
    create_button("Reset team", "reset_team_keypad();");
    create_button();
    create_button("Reset match", "reset_match_keypad();");
    create_break();
    create_button("Reset server games", "CONNECTION.send(\"q;" + A_TOKEN + ";1;0;\");");
}

function reset_team_keypad() {
    clear_page();
    create_text_massive("Enter team number");
    create_numpad("reset_team_keypad();", "CONNECTION.send(\"q;" + A_TOKEN + ";3;NUMPADRESULT;\");");
}

function reset_match_keypad() {
    clear_page();
    create_text_massive("Enter match number");
    create_numpad("reset_match_keypad();", "CONNECTION.send(\"q;" + A_TOKEN + ";4;NUMPADRESULT;\");");
}

function change_password() {
    clear_page();
    create_text_massive("Enter password");
    create_numpad("change_password();", "confirm_change();");
}

function confirm_change() {
    CONNECTION.send("q;" + A_TOKEN + ";2;" + NUMPADRESULT + ";");
    portal();
}