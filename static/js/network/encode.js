function raw_from_packets(packets) {
    ret = "";
    for (let i = 0; i < packets.length; i++) {
        let thisp = packets[i];
        switch (thisp.packet_type) {
            case 0: // PingUSID (no data)
                ret += "0;";
                break;
            case 1: // PongUSID (usid num)
                ret += "1;";
                ret += thisp.usid;
                ret += ";";
                break;
            case 2: // PingServer (usid num)
                ret += "2;";
                ret += thisp.usid;
                ret += ";";
                break;
            case 3: // PongServer (usid num)
                ret += "3;";
                ret += thisp.usid;
                ret += ";";
                break;
            case 4: // PingClient (server accociated location)
                ret += "4;";
                ret += thisp.server_loc;
                ret += ";";
                break;
            case 5: // PongClient (usid, server accociated location)
                ret += "5;";
                ret += thisp.usid;
                ret += ";";
                ret += thisp.server_loc;
                ret += ";";
                break;
            case 6: // G2020RobotSelected (usid, robot team num)
                ret += "6;";
                ret += thisp.usid;
                ret += ";";
                ret += thisp.team_number;
                ret += ";";
                break;
            case 9: // G2020RequestWaiting ()
                ret += "9;";
                break;
            case 10: // G2020RequestRunningGameID ()
                ret += "a;";
                break;
            case 12: // G2020LeaveQueue (usid)
                ret += "c;";
                ret += thisp.usid;
                ret += ";";
                break;
            default:
                console.error("Unkown packet id while compressing: " + thisp.packet_type);
                break;
        }
    }
    return ret;
}
