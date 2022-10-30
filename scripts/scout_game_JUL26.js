let server_ip = "124.218.222.22";
let websocket_port = 8001;
let websocket_url = "ws://" + server_ip + ":" + websocket_port;
let not_login = true;
const socket = new WebSocket(websocket_url) ;

try {
    socket.onopen = function(event) {
        console.log("socket successful connected to" + websocket_url);
        console.log(event);
    }
}catch{
    alert("websocket not established. refresh the page or contact the host.")
};

socket.onmessage = function(event) {
    console.log("got ws msg");
    console.log(event);
    var recieved_data = JSON.parse(event.data);
    // only for testing
    console.log(recieved_data);
    if(recieved_data.team == $("#team-input").val()){
        switch(recieved_data.method){
            case "login_reply":
                if(recieved_data.successful){
                    $("#problem-body").toggle(0);
                    // $("#login-body").toggle(0);
                    $("#team-input").addClass("disabled readonly").attr("disabled", "true");
                    $("#password-input").addClass("disabled readonly").attr("disabled", "true");
                    $("#login-button").addClass("disabled");
                }else if(!recieved_data.successful)(
                    alert("login failed!!")
                );
                break;
            case "problem":
                $("#problem-image").attr("src", recieved_data.img_path)
                $("#problem-discription").text(recieved_data.discription);
                $("#problem-discription").text(recieved_data.discription);
                $("#chances-remaning").text(recieved_data.chances_remaining);
                $("#finnished_problems").text(recieved_data.finnished_problems);
                $("#remaining_problems").text(recieved_data.remaining_problems);
                break;
            case "answer_reply":
                if (recieved_data.success){
                    alert("answer correct");
                }else if (!recieved_data.success){
                    alert("answer incorrect");
                $("#chances-remaning").text(recieved_data.chances_remaining);
                }
                break;
            case "skip_reply":
                alert("skipped")
                break;
            case "the_end":
                alert("the end")
                break;
        };
    }else if(recieved_data.method == "announcement"){
        $("#announcement").text(recieved_data.announcement);
    };
};

socket.onclose = function(e) {
    console.log("socket closed");
    alert("Connection lost, refresh is recommended.")
}


$(document).ready(function(){ // or you can type "$(function(){}"
    $("#problem-body > div > div").addClass("p-2");
    $("#problem-body > div").addClass("gx-5");
    $("#login-session > div > div").addClass("p-2");
    $("#problem-body > div").addClass("gx-5");
    $("#problem-body").toggle(0);
    $("#login-button").click(function(){
        send_JSON =
            {
                "method": "login",
                "team" : $("#team-input").val(),
                "password" : $("#password-input").val(),
            };
        console.log(send_JSON);
        socket.send(JSON.stringify(send_JSON));
    });
    $("#send-button").click(function(){
        if (parseInt( $("#chances-remaning").text(), 10 ) <= 0){
            alert("no chances for you any more");
            return;
        };
        if (confirm("Are you sure you want to send answer?")){
            img_src_split = $("#problem-image").attr("src").split("/");
            problem_number = img_src_split[img_src_split.length - 1].slice(1,-4);
            send_JSON =
                {
                    "method": "answer",
                    "team" : $("#team-input").val(),
                    "password" : $("#password-input").val(),
                    "problem_number" : problem_number,
                    "answer" : $("#answer-input").val()
                };
            console.log(send_JSON);
            socket.send(JSON.stringify(send_JSON));
        };
    });
    $("#skip-button").click(function(){
        if(confirm("Are you sure you want to skip?")){
            img_src_split = $("#problem-image").attr("src").split("/");
            problem_number = img_src_split[img_src_split.length - 1].slice(1,-4);
            send_JSON =
                {
                    "method": "skip",
                    "team" : $("#team-input").val(),
                    "password" : $("#password-input").val(),
                    "problem_number" : problem_number,
                };
            console.log(send_JSON);
            socket.send(JSON.stringify(send_JSON));
        };
    });
});
