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
        case "json" :
            return "application/json";
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
        try{
            console.log(req);
            console.log(req.json());
        }catch(err){
            console.log(err);
        }
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
let database_team_path = "scout_game_JUL26_team_list.json";
let database_problem_path = "scout_game_JUL26_problem_list.json";
let database_team_raw = fs.readFileSync(database_team_path);
let database_problem_raw = fs.readFileSync(database_problem_path);
let database_team = JSON.parse(database_team_raw);
let database_problem = JSON.parse(database_problem_raw);
console.log(database_team);
console.log(database_problem);

const ws_server = new WebSocket.Server({
    port : websocketport
});
console.log("websocket on: " + websocketport);

let sockets = [];


let announcement_str = fs.readFileSync("announcement.txt", "utf8");
console.log(announcement_str);

// for godmode //

let godmode_websocketport = 8002 ;
let godmode_sockets = [];
const godmode_ws_server = new WebSocket.Server({
    port : godmode_websocketport
});
console.log("godmode websocket on: " + godmode_websocketport);

godmode_ws_server.on('connection', function(socket) {
    godmode_sockets.push(socket);
    console.log("someone opened godmode");
    socket.send(JSON.stringify(
        {
            "method": "announcement",
            "announcement": announcement_str
        }
    ));
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

        switch (recieved_data.method) {
            case "announce":
                announcement_str = recieved_data.announcement;
                godmode_sockets.filter(s => s !== socket).forEach(s => s.send(JSON.stringify(
                    {
                        "method": "announcement",
                        "announcement": announcement_str
                    }
                )));
                sockets.forEach(s => s.send(JSON.stringify(
                    {
                        "method": "announcement",
                        "announcement": announcement_str
                    }
                ))
                );
                fs.writeFileSync("announcement.txt", announcement_str)
                break;
        }
    });
    socket.on('close', function() {
        sockets = sockets.filter(s => s !== socket);
    });
});
// godmode end //

ws_server.on('connection', function(socket) {
    sockets.push(socket);
    json_to_send = JSON.stringify(
        {
            "method": "announcement",
            "announcement": announcement_str
        }
    );
    socket.send(json_to_send);
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

        try{
            console.log(database_team[recieved_data.team]);
            if (database_team[recieved_data.team].remaining.length == 0) {
                json_to_send = JSON.stringify(
                    {
                        "method": "the_end",
                        "team": recieved_data.team
                    }
                );
                sockets.forEach(s => s.send(json_to_send));
            }
        } catch(error) {
            console.log(error.message);
        };

        let success = false;
        switch (recieved_data.method) {
            case "login":
                if(recieved_data.team in database_team){
                    if(recieved_data.password == database_team[recieved_data.team].password){ success = true; };
                    console.log("login successfull");
                    json_to_send = JSON.stringify( { "method": "login_reply", "successful": success , "team": recieved_data.team});
                    socket.send(json_to_send);
                    json_to_send = JSON.stringify(JSONtoSendProblem(recieved_data.team));
                    socket.send(json_to_send);
                    json_to_send = JSON.stringify(
                        {
                            "method": "announcement",
                            "announcement": announcement_str
                        }
                    );
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

                    if ( database_team[recieved_data.team].chance_remaining <= 0 ) {
                        json_to_send = JSON.stringify(
                            {
                                "team": recieved_data.team,
                                "skip": true,
                                "method": "skip_reply",
                                "success": true
                            }
                        )
                        sockets.forEach(s => s.send(json_to_send));
                        if(!skipProblem(recieved_data.team)){
                            json_to_send = JSON.stringify(
                                {
                                    "method": "the_end",
                                    "team": recieved_data.team
                                }
                            );
                            sockets.forEach(s => s.send(json_to_send));
                            break;
                        };
                        json_to_send = JSON.stringify(JSONtoSendProblem(recieved_data.team));
                        sockets.forEach(s => s.send(json_to_send));
                        updateDatabase();
                    };
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
                        "success": success,
                        "chances_remaining": database_team[recieved_data.team].chance_remaining
                    }
                )
                sockets.forEach(s => s.send(json_to_send));
                if (success){
                    json_to_send = JSON.stringify(JSONtoSendProblem(recieved_data.team));
                    // socket.send(json_to_send);
                    sockets.forEach(s => s.send(json_to_send));
                }
                updateDatabase();
                break;
            case "skip":
                json_to_send = JSON.stringify(
                    {
                        "team": recieved_data.team,
                        "skip": true,
                        "method": "skip_reply",
                        "success": true
                    }
                )
                sockets.forEach(s => s.send(json_to_send));
                if(!skipProblem(recieved_data.team)){
                    json_to_send = JSON.stringify(
                        {
                            "method": "the_end",
                            "team": recieved_data.team
                        }
                    );
                    sockets.forEach(s => s.send(json_to_send));
                    break;
                };
                json_to_send = JSON.stringify(JSONtoSendProblem(recieved_data.team));
                sockets.forEach(s => s.send(json_to_send));
                updateDatabase();
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
    database_team[team].skipped.push(database_team[team].current);
    return nextProblem(team);
}

function nextProblem(team){
    console.log("next Problem for " + team);
    database_team[team].chance_remaining = 5;
    if (database_team[team].remaining.length == 0) {
        database_team[team].current = -2;
        return false;
    }else{
        next_Problem_number = ~~( database_team[team].remaining.length * Math.random() );
        console.log(next_Problem_number);
        console.log(database_team[team].remaining[next_Problem_number]);
        if( database_team[team].current != -1 && !database_team[team].skipped.includes( database_team[team].current )){
            database_team[team].finnished.push(database_team[team].current);
        }
        database_team[team].current = database_team[team].remaining[next_Problem_number];
        database_team[team].remaining.splice(next_Problem_number, 1)
        return true;
    }
}
function answerIsCorrct(recieved_json){
    if (recieved_json.answer == database_problem.problem_list[recieved_json.problem_number].answer){
        return true;
    }else{
        database_team[recieved_json.team].chance_remaining -= 1;
        return false;
    }
};

function JSONtoSendProblem(team){
    if(database_team[team].current == -1){ nextProblem(team); };
    console.log(team)
    console.log(database_team[team])
    let image_path = "images/scout_game_JUL26/" + database_problem.problem_list[database_team[team].current].img_path;
    // if (database_team[team].current == -1 ) {
    //     let image_path = "images/scout_game_JUL26/Q-1.jpg" ;
    // } else {
    //     image_path = "images/scout_game_JUL26/" + database_problem.problem_list[database_team[team].current].img_path;

    // }
    return {
        "method": "problem",
        "discription": database_problem.problem_list[database_team[team].current].discription,
        "img_path": image_path,
        "team": team,
        "finnished_problems": database_team[team].finnished.length,
        "remaining_problems": database_team[team].remaining.length,
        "chances_remaining": database_team[team].chance_remaining
    };
    return {
        "method": "all_done",
        "team": team,
    }
}

function updateDatabase(){
    godmode_sockets.forEach(s => s.send(JSON.stringify(
        {
            "method": "teams_score",
            "teams_score": database_team
        }
    )));
    fs.writeFileSync(database_team_path, JSON.stringify(database_team))
}
