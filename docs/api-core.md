Using the API
===

Connecting via WebSocket
---
The websocket server is hosted at the IP address of your server on port 81, unless reconfigured. In Javascript connecting is as easy as the following code sample:

```js
IP = "example.ip.address.here";
PORT = "81";
/**
 * Requests something from the server.
 * @param {Object} request - Object of request to send
 * @returns {Object} - Object of response
 */
function server_request(request) {
    // create a new connection to IP:PORT
    CONNECTION = new WebSocket("ws://" + IP + ":" + PORT);
    // return response when recieved
    CONNECTION.onmessage = function(e) {
        return e.data;
    }
    // send message as soon as we can
    CONNECTION.onopen = function(_) {
        CONNECTION.send(JSON.stringify(request));
    }
}
```

Why not POST/GET?
---
2 reasons.  
1) This is *kinda* built off of the base of netcode v4 which used websockets and
2) using websockets gives more customization in the protocol with less overhead

JSON Format
---
When sending a request, some things are assumed about the Object that you send. Every request object has a `request` field which is a String. Every response object has a `result` field, also a String. Based on the kind of request field you have, it will be assumed that you do or don't have various other fields, specified below. The result field will give you a good indication of any other fields avalble, also specified below.

Checking Versions
---
When you connect, it is **ESSENTIAL** that you check versions. If you don't, you can run into a whole host of problems that can be hard to diagnose and can easily break custom clients, and even occasionally servers. Use the `version` request field shown below.

Requests
---

Responses
---
