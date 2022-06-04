const http = require('http');
const fs = require('fs');
const url = require('url');
const util = require('util');
const webSocketServer = require('ws').Server;
const httpport = 80;
const websocketport = 8000;

var ws = new webSocketServer({port: websocketport});

function afterDotToFileType(afterDot) {
    switch (afterDot) {
        case "ico" :
            return "image/vnd.microsoft.icon";
            break;
        case "js" :
            return "text/javascript";
            break;
        case "html" :
            return "text/html";
            break;
        case "css" :
            return "text/css";
            break;
    }
};


// the function to call every time it recieves request
const server = http.createServer(function(req, res) {
    console.log('got a request!');
    let path = url.parse(req.url, true);
    let file_requested = "." + path.pathname;
    if (file_requested == "./") { file_requested = "index.html"}
    let file_afterdot = file_requested.split(".").pop();
    console.log(path);
    console.log(afterDotToFileType(file_afterdot));

    res.writeHead(200, { 'Content-Type': afterDotToFileType(file_afterdot) });
    fs.readFile(file_requested, function(error, data) {
        if (error) {
            res.writeHead(404);
            res.write('error: something in this server has gone wrong');
        } else { res.write(data); };
        res.end();
    });
});

// to set up the server to listen on the port
server.listen(httpport, function(error) {
    if (error) {
        console.log('Something went wrong', error)
    } else {
        console.log('Server is listening on port :' + httpport)
    }
});
