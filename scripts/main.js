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

$(document).ready(function(){ // or you can type "$(function(){}"
    $("head").append("link").attr("rel", "icon").attr("type", "image/ico").attr("href", "images/favicon.ico") ;
    $("nav").attr("class", "navbar navbar-expand-sm bg-dark navbar-dark sticky-top").append($("<a></a>").attr("class", "navbar-brand").text("Logo").attr("hreff", "index.html")).append($("<ul></ul>").attr("class", "navbar-nav")) ;
    nav_elements.forEach(set_nav) ;
    if (location.pathname == "index.html") {
        $.when(getdata()).then(function(tdata) {
            data = tdata ;
            PrintData() ;
        }) ;
    } ;
});

