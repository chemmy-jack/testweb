const http = require('http');
const fs = require('fs');
const url = require('url');
const util = require('util');
const WebSocket = require('ws');
const httpport = 8888;
const websocketport = 8080;



// websocket client end

function afterDotToFileType(afterDot) {
    switch (afterDot) {
        case "jpg" :
            return "image/jpg";
            break;
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
    if(req.method == "GET") {
        console.log("here is a get request");
        try {
            let path = url.parse(req.url, true);
            let file_requested = "." + path.pathname;
            if (file_requested == "./") { file_requested = "scout_game_JUL26.html"}
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
        } catch {
            console.log("not recognized :");
            console.log(req);
        };
    } else if ( req.method == "POST" ) {

        console.log("here is a post request");
        // let path = url.parse(req.url, true);
        // console.log(path);
        console.log(req);
    } else {
        console.log("not recongnized method: "+ req.method);
    }
});

// to set up the server to listen on the port
server.listen(httpport, function(error) {
    if (error) {
        console.log('Something went wrong', error)
    } else {
        console.log('Server is listening on port :' + httpport)
    }
});

// game
// read database
let database_raw = fs.readFileSync("scout_game_JUL26.json");
let database = JSON.parse(database_raw);
console.log("this is the database")
console.log(database);

// websocket server end
const ws_server = new WebSocket.Server({
    port : websocketport
});
console.log("websocket on: " + websocketport);

let sockets = [];

ws_server.on('connection', function(socket) {
    sockets.push(socket);
    socket.on('message', function(msg) {
        let recieved_data;
        try {
            recieved_data = JSON.parse(msg);
            console.log(recieved_data);
        } catch(error) {
            console.log("not json");
            console.log("error: " + error.message);
            console.log("message: \n" + msg);
            return 0;
        };

        if(recieved_data.method == "init"){
            let success = false;
            if(recieved_data.team in database.team_list){
                if(recieved_data.password == database.team_list[recieved_data.team].password){ success = true; };
                console.log("login successfull");
            };
            json_to_send = JSON.stringify( { "method": "init_reply", "successful": success })
        }
        socket.send(json_to_send);
        console.log("sent json back");
        console.log(json_to_send);
        // sockets.forEach(s => s.send(json_to_send));
        // console.log(sockets)
    });
    socket.on('close', function() {
        sockets = sockets.filter(s => s !== socket);
    });
});

function nextProblem(team){
    if (data.team_list[team].remaining != []) {
        return {
            "method": "all_done",
            "team": team,
        }
    }else{
        next_Problem_number=database.team_list[team].remaining.length * Math.random;
        database.team_list[team].current = database.team_list[team].remaining[next_Problem_number];
        database.team_list[team].remaining = database.team_list[team].remaining.splice(next_Problem_number, next_Problem_number)
        let image_path = "images/scout_game_JUL26/" + data.problem_list[database.team_list[team].current].img_path;
        return {
            "method": "problem",
            "discription": data.problem_list[database.team_list[team].current].discription,
            "img_path": image_path
        };
    }
}
function answerIsCorrct(recieved_json){

};
