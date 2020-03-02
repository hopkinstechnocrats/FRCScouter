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
                });
                break;
            case "2": // PingServer (usid num)
                position++;
                ret.push({
                    packet_type: 2,
                    usid: parseInt(data_chunks[position], 10)
                });
                break;
            case "3": // PongServer (usid num)
                postion++;
                ret.push({
                    packet_type: 3,
                    usid: parseInt(data_chunks[position], 10)
                });
                break;
            case "4": // PingClient (server accociated location)
                position++;
                ret.push({
                    packet_type: 4,
                    server_loc: parseInt(data_chunks[position], 10)
                });
                break;
            case "5": // PongClient (usid num, server accociate location)
                position += 2;
                ret.push({
                    packet_type: 5,
                    usid: parseInt(data_chunks[position - 1], 10),
                    server_loc: parseInt(data_chunks[position], 10)
                });
                break;
            case "7": // G2020ScoutersWaiting ([length], Vec<team number, amount> where len = [length])
                position++;
                let len = parseInt(data_chunks[position], 10);
                let fin = [];
                for (let i = 0; i < len; i++) {
                    position += 2;
                    fin.push({team: data_chunks[position - 1], amount: data_chunks[position]});
                }
                ret.push({
                    packet_type: 7,
                    scouters: fin
                });
                break;
            case "8":
                position++;
                ret.push({
                    packet_type: 8
                });
                break;
            case "m":
                position += 2;
                ret.push({
                    packet_type: 22,
                    size: data_chunks[position - 1],
                    json: data_chunks[position]
                })
                break;
            case "o":
                position++;
                A_STATUS = 2;
                break;
            case "p":
                position += 2;
                A_STATUS = 1;
                A_TOKEN = data_chunks[position - 1]
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
