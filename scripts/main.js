const nav_elements = [
    [ "home", "index.html" ],
    [ "test 1", "index1.html" ],
    [ "test 2", "index2.html" ],
    [ "snake game!", "index3.html" ]
]
let nav_str = ""
for ( var i = 0 ; i < nav_elements.length ; i++ ) {
    nav_str += "<li><a href='" + nav_elements[i][1] + "'>" + nav_elements[i][0] + "</a></li>\n"
}
console.log(nav_str) ;
$(document).ready(function(){ // or you can type "$(function(){}"
    $("#nav").html(nav_str) ;
});
