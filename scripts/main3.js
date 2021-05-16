var snake_canvas = document.getElementById("snake_canvas") ;
const w = snake_canvas.width ;
const h = snake_canvas.height ;
var ctx = snake_canvas.getContext("2d") ;

function draw_line(x1,y1,x2,y2) {
    ctx.moveTo(x1,y1) ;
    ctx.lineTo(x2,y2) ;
    ctx.stroke() ;
}

// create gridlines for 10x10
const ws = 10 ;
const hs = 10 ;
const x0 = w/ws ;
const y0 = h/hs ;
function create_gridlines() {
    for ( i=0 ; i < ws ; i++ ) {
        var x = x0*i ;
        draw_line(x,0,x,h) ;
    }
    for ( i=0 ; i < hs ; i++ ) {
        var y = y0*i ;
        draw_line(0,y,w,y) ;
    }
}
create_gridlines()

// create direction and keyboard listening
let direction = ""
function update_direction(key) {
    switch (key) {
        case "w" :
        case "ArrowUp" :
            direction = "up" ;
            break ;
        case "a" :
        case "ArrowLeft" :
            direction = "left" ;
            break ;
        case "s" :
        case "ArrowDown" :
            direction = "down" ;
            break ;
        case "d" :
        case "ArrowRight" :
            direction = "right" ;
            break ;
    }
    console.log("direction:",direction) ;
}

document.addEventListener('keydown', (event) => {
    update_direction(event.key) ;
}, false) ;

// create snake and apple
let snake = {
    name : "snake" ,
    life : true ,
    body : [] ,
    color : "#00ff00" ,
    update : function() {}
}
let apple = {
    name : "apple" ,
    color : "#ff0000" ,
    x : 0 ,
    y : 0 ,
    AppleNotInSnake : function() {
        for ( i=0 ; i <= snake.body.lenth ; i++ ) {
            if (this.x == snake.body[i][0] || this.y == snake.body[i][1] ) {return true}
        }
        return false ;
    } ,
    update : function() {
        do {
            this.x = Math.floor(Math.random() * ws)
            this.y = Math.floor(Math.random() * hs)
        } while (this.AppleNotInSnake()) ;
        console.log(this.x, this.y) ;
    }
}

// start movement
function fill(xa, ya, obj=snake) {
    let x = xa*x0 ;
    let y = ya*y0 ;
    if (obj == "erase") {
        ctx.clearRect(x,y,x0,y0) ;
        return ;
    }
    ctx.fillStyle = obj.color ;
    ctx.fillRect(x,y,x0,y0) ;
}
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
const dt = 500 ;
snake.body.append([0,0]) ;
async function start_snake() {
    while (snake.life) {
        await sleep(dt) ;
        snake.update() ;
    }
}

ctx.fillStyle = "#FF7700" ;
ctx.fillRect(200,60,150,75) ;
