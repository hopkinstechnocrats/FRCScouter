function packets_from_raw(raw) {
    let ret = [];
    let data_chunks = raw.split(';');
    data_chunks.pop();
    let position = 0;
    while (position < data_chunks.length) {
        switch (data_chunks[position].trim()) {
            case "0": // PingUSID (no data)
                ret.push({
                    packet_type: 0
                });
                break;
            case "1": // PongUSID (usid num)
                position++;
                ret.push({
                    packet_type: 1,
                    usid: parseInt(data_chunks[position], 10)
                })
                break;
            default:
                console.error("An unkown data chunk was found while scanning for packets: " + data_chunks[position]);
                console.error("all of data_chunks:\n" + data_chunks);
                break;
        }
        position++;
    }
    return ret;
}