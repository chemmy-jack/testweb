const http = require('http');
const fs = require('fs');
const url = require('url');
const util = require('util');
const WebSocket = require('ws');
const httpport = 8000;
const websocketport = 8001;



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

// // // // // // // // // //
// game
// // // // // // // // // //
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

        let success = false;
        switch (recieved_data.method) {
            case "login":
                if(recieved_data.team in database.team_list){
                    if(recieved_data.password == database.team_list[recieved_data.team].password){ success = true; };
                    console.log("login successfull");
                    json_to_send = JSON.stringify( { "method": "login_reply", "successful": success , "team": recieved_data.team});
                    socket.send(json_to_send);
                    json_to_send = JSON.stringify(JSONtoSendProblem(recieved_data.team));
                    socket.send(json_to_send);
                };
                break;
            case "answer":
                if(answerIsCorrct(recieved_data)){
                    if(!nextProblem(recieved_data.team)){
                        json_to_send = JSON.stringify(
                            {
                                "method": "the_end",
                                "team": recieved_data.team
                            }
                        );
                        sockets.forEach(s => s.send(json_to_send));
                        break;
                    };
                    success =true
                }else{
                    success = false
                }
                json_to_send = JSON.stringify(
                    {
                        "team": recieved_data.team,
                        "skip": false,
                        "method": "answer_reply",
                        "success": success
                    }
                )
                sockets.forEach(s => s.send(json_to_send));
                if (success){
                    json_to_send = JSON.stringify(JSONtoSendProblem(recieved_data.team));
                    // socket.send(json_to_send);
                    sockets.forEach(s => s.send(json_to_send));
                }
                break;
            case "skip":
                skipProblem(recieved_data.team)
                json_to_send = JSON.stringify(
                    {
                        "team": team,
                        "skip": true,
                        "method": "skip_reply",
                        "success": true
                    }
                )
                sockets.forEach(s => s.send(json_to_send));
                json_to_send = JSON.stringify(JSONtoSendProblem(recieved_data.team));
                sockets.forEach(s => s.send(json_to_send));
                break;
        }
        // sockets.forEach(s => s.send(json_to_send));
        // console.log(sockets)
    });
    socket.on('close', function() {
        sockets = sockets.filter(s => s !== socket);
    });
});

function skipProblem(team){
    console.log("skip Problem for " + team);
    database.team_list[team].push(database.team_list.current);
    return nextProblem(team);
}

function nextProblem(team){
    console.log("next Problem for " + team);
    if (database.team_list[team].remaining == []) {
        database.team_list[team].current = -2;
        return false;
    }else{
        next_Problem_number = ~~( database.team_list[team].remaining.length * Math.random() );
        console.log(next_Problem_number);
        console.log(database.team_list[team].remaining[next_Problem_number]);
        database.team_list[team].finnished.push(database.team_list.current);
        database.team_list[team].current = database.team_list[team].remaining[next_Problem_number];
        database.team_list[team].remaining.splice(next_Problem_number, 1)
        return true;
    }
}
function answerIsCorrct(recieved_json){
    if (recieved_json.answer == database.problem_list[recieved_json.problem_number].answer){
        return true;
    }else{
        return false;
    }
};

function JSONtoSendProblem(team){
    if(database.team_list[team].current == -1){ nextProblem(team); };
    console.log(team)
    console.log(database.team_list[team])
    console.log()
    console.log()
    let image_path = "images/scout_game_JUL26/" + database.problem_list[database.team_list[team].current].img_path;
    return {
        "method": "problem",
        "discription": database.problem_list[database.team_list[team].current].discription,
        "img_path": image_path,
        "chance_remaining": database.team_list.chance_remaining,
        "team": team,
        "finnished_problems": database.team_list.finnished.length(),
        "remaining_problems": database.team_list.remaining.length()
    };
    return {
        "method": "all_done",
        "team": team,
    }
}
