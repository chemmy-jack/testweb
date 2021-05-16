var snake_canvas = document.getElementById("snake_canvas") ;
const w = snake_canvas.width ;
const h = snake_canvas.height ;
var ctx = snake_canvas.getContext("2d") ;
ctx.fillStyle = "#FF7700" ;
ctx.fillRect(200,60,150,75) ;

ctx.moveTo(w/2,h/2) ;
ctx.lineTo(w,h) ;
ctx.stroke() ;

const radius = 50 ;
ctx.beginPath() ;
ctx.arc(w/2 ,h/2 ,radius, 0,2*Math.PI ) ;
ctx.stroke() ;

// create gradient
var grd = ctx.createRadialGradient(75, 50, 5, 90, 60, 100) ;
grd.addColorStop(0, "red") ;
grd.addColorStop(1, "white") ;

// Fill with gradient
ctx.fillStyle = grd ;
ctx.fillRect(10, 10, 150, 80) ;

// text
ctx.fillStyle = "black" ;
ctx.font = "30px Arial" ;
ctx.fillText("hello World!", 100, 50) ;
ctx.strokeText("hello World!", w/2, h/2) ;
ctx.font = "50px Comic Sans Times" ;
ctx.textAlign = "center" ;
ctx.fillText("hello World!", w/2, 100) ;

document.addEventListener('keydown', (event) => {
    var name = event.key ;
    var code = event.code ;
    alert(`Key pressed ${name} \r\n Key code value: ${code}`);
}, false) ;
