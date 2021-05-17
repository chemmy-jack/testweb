$(document).ready(function(){ // or you can type "$(function(){}"
    $("p").css("font-size", " 30px") ;
    $("p").click(function(){
        $(this).hide() ;
    }) ;
    $("button").dblclick(function(){
        $("p").css("font-size", " 50px") ;
    }) ;
});
