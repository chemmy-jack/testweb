const nav_elements = [
    [ "home", "index.html" ],
    [ "snake game!", "index3.html" ],
    [ "test 1", "index1.html" ],
    [ "test 2", "index2.html" ]
]
function set_nav(item, index) {
    $("#nav").append($("<li></li>").text("").append($("<a></a>").text(item[0]).attr("href", item[1]))) ;
}

$(document).ready(function(){ // or you can type "$(function(){}"
    $("#nav").empty() ;
    nav_elements.forEach(set_nav) ;
});
