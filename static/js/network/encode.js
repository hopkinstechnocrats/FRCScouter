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
            default:
                console.error("Unkown packet id while compressing: " + thisp.packet_type);
                break;
        }
    }
    return ret;
}