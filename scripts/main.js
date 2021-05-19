const nav_elements = [
    [ "home", "index.html" ],
    [ "snake game!", "index3.html" ],
    [ "test 1", "index1.html" ],
    [ "test 2", "index2.html" ]
]
function set_nav() {
    $("#nav").empty() ;
    for ( var i = 0 ; i < nav_elements.length ; i++ ) {
        let txta = $("<a></a>").text(nav_elements[i][0]).attr("href", nav_elements[i][1]) ;
        let txt = $("<li></li>").text("") ;
        $("#nav").append(txt.append(txta)) ;
    }
}

$(document).ready(function(){ // or you can type "$(function(){}"
    set_nav()
});
