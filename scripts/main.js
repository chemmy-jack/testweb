$("head").append("link").attr("rel", "icon").attr("type", "image/ico").attr("href", "images/favicon.ico") ;
home_path = "/index.html" ;
function getdata() {
    let data_url = "https://data.epa.gov.tw/api/v1/aqx_p_136?format=json&limit=2000&api_key=9be7b239-557b-4c10-9775-78cadfc555e9" ;
    return $.getJSON(data_url) ; 
}
let data = {};

function PrintData() {
    console.log(data) ;
    var Feilds = data.fields ;
    var Record = data.records ;
    let btitle = $("#testtable > table > thead > tr") ;
    let bbody = $("#testtable > table > tbody") ;
    btitle.empty() ;
    for (i in Feilds){
        console.log(Feilds[i].id, Feilds[i].info.label) ;
        btitle.append($("<th></th>").text(Feilds[i].info.label)).attr("title", Feilds[i].id) ;
    }
    for (i in Record) {
        bbody.append($("<tr></tr>").attr("id", "id-" + i)) ;
        for (j in Record[i]) {
            bbody.last().append($("<th></th>").text(Record[i][j]));
        }
        // for (j in Record[i]) {
        //     bbody.append($("<th></th>").text(Feilds[i].info.label)).attr("title", Feilds[i].id) ;
    }
}

const nav_elements = [
    [ "mine sweeper", "index4.html" ],
    [ "snake game!", "index3.html" ],
    [ "test 1", "index1.html" ],
    [ "test 2", "index2.html" ]
]
function set_nav(item, index) {
    $(".navbar-nav").append($("<li></li>").attr("class", "nav-item").append($("<a></a>").attr("class", "nav-link").text(item[0]).attr("href", item[1]))) ;
}

const socket = new WebSocket("wss://140.83.57.234")

socket.onopen = function(event) {
    alert('Socket connected successfully');
    console.log(event);
    setTimeout(function() {
        socket.send("hey there");
    }, 1000);
};

socket.onmessage = function(event) {
    console.log(event);
};

$(document).ready(function(){ // or you can type "$(function(){}"
    $("nav")
        .attr("class", "navbar navbar-expand-sm bg-dark navbar-dark sticky-top")
        .append($("<div></div>") .attr("class", "container-fluid")
                .append($("<a></a>") .attr("class", "navbar-brand") .text("Logo") .attr("href", home_path))
                .append($("<button></button>")
                    .attr("type", "button")
                    .attr("class", "navbar-toggler ml-auto float-xs-right pull-right navbar-toggler-right")
                    .attr("data-toggle", "collapse")
                    .attr("data-target", "#navbar")
                    .attr("aria-expanded", "false")
                    .attr("aria-controls", "navbar")
                    .attr("aria-label", "Toggle navigation")
                        .append($("<span></span>") .attr("class", "navbar-toggler-icon")))
            .append($("<div></div>") .attr("class", "navbar-collapse collapse") .attr("id", "navbar")
                .append($("<ul></ul>") .attr("class", "navbar-nav ")))) ;
    nav_elements.forEach(set_nav) ;
    if (location.pathname == home_path) {
        $.when(getdata()).then(function(tdata) {
            data = tdata ;
            PrintData() ;
        }) ;
    } ;
});

