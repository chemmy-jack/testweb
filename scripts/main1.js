function click_button() {
    document.getElementById('script_demo').style.color = "red" ;
    document.getElementById('script_demo').style.fontSize = "25px" ;
    document.getElementById('script_demo').innerHTML += Date() + "    " ;
}

$(document).ready(function(){ // or you can type "$(function(){}"
    $("#svg_test").attr("alt", "alt changed!").attr("src", "images/test.svg") ;
    $("urlimg_test").attr("src", "") ;
})
