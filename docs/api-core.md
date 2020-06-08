Using the API
===

Requesting via WebSocket
---
The websocket server is hosted at the IP address of your server on port 81, unless reconfigured. In Javascript connecting is as easy as the following code sample:

```js
IP = "example.ip.address.here";
PORT = "81";
DATA = {};
/**
 * Requests something from the server. Populates DATA when received.
 * @param {Object} request - Object of request to send
 */
function server_request(request) {
    DATA = {};
    // create a new connection to IP:PORT
    CONNECTION = new WebSocket("ws://" + IP + ":" + PORT);
    // return response when recieved
    CONNECTION.onmessage = function(e) {
        DATA = e.data;
    }
    // send message as soon as we can
    CONNECTION.onopen = function(_) {
        CONNECTION.send(JSON.stringify(request));
    }
}
```

JSON Format
---
When sending a request, some things are assumed about the Object that you send. Every request object has a `request` field which is a String. Every response object has a `result` field, also a String. Based on the kind of request field you have, it will be assumed that you do or don't have various other fields, specified below. The result field will give you a good indication of any other fields avalble, also specified below.

Checking Versions
---
When you connect, it is **ESSENTIAL** that you check versions. If you don't, you can run into a whole host of problems that can be hard to diagnose and can easily break custom clients, and even occasionally servers. Use the `version` request field shown below.

Format for Normal Requests and Responses
---
**Get server version**  
Queries a server for the version of netcode/the API that it is using

Request
```json
{
    "request": "version"
}
```
Response
```json
{
    "result": "version",
    "version": "version_name_here"
}
```


**Get Plugins**  
Queries a server for a list of plugins.

```json
// Request
{
    "request": "plugins"
}
```

The response is a list of Strings containing a plugin names.
```json
// Response
{
    "result": "plugins",
    "plugins": [
        "exampleplugin"
    ]
}
```

Unusual Responses
---

This is a list of responses you might not expect from a particular request but that can be emmited at any point.  

**Unkown request**  

The `request` field of the header was not a known value.
```json
// Response
{
    "result": "unkown-request",
    "request": "the_received_and_unkown_request"
}
```

**Missing or broken key**

Data received was missing a key part of the JSON, or a part of the JSON was in the wrong format.
```json
// Response
{
    "result": "broken-key"
}
```

**Wrong format**

Data received was in the wrong format. (sent bytes instead of a string)
```json
// Response
{
    "result": "wrong-format"
}
```

**Not JSON**

Data received was not parseable JSON.
```json
// Response
{
    "result": "not-json"
}
```
