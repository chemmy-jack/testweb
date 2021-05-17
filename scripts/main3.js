var snake_canvas = document.getElementById("snake_canvas") ;
const w = snake_canvas.width ;
const h = snake_canvas.height ;
var ctx = snake_canvas.getContext("2d") ;

function draw_line(x1,y1,x2,y2) {
    ctx.fillStyle = line_color ;
    ctx.moveTo(x1,y1) ;
    ctx.lineTo(x2,y2) ;
    ctx.stroke() ;
}

// create gridlines for 10x10
const ws = 10 ;
const hs = 10 ;
const x0 = w/ws ;
const y0 = h/hs ;
const line_color = "#777777" ;
let pause = false ;
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
// create_gridlines()

// create direction and keyboard listening
let direction = "right"
function update_direction(key) {
    switch (key) {
        case "w" :
        case "ArrowUp" :
            if (direction == "down") { return ; } ;
            direction = "up" ;
            break ;
        case "a" :
        case "ArrowLeft" :
            if (direction == "right") { return ; } ;
            direction = "left" ;
            break ;
        case "s" :
        case "ArrowDown" :
            if (direction == "up") { return ; } ;
            direction = "down" ;
            break ;
        case "d" :
        case "ArrowRight" :
            if (direction == "left") { return ; } ;
            direction = "right" ;
            break ;
        case "p" :
            pause = !pause ;
            if (!pause) { start_snake() ; }
            break ;
    }
    console.log("direction:",direction) ;
}

document.addEventListener('keydown', (event) => {
    update_direction(event.key) ;
}, false) ;

// create snake and apple
function fill(p, obj=snake) {
    let x = p[0]*x0 ;
    let y = p[1]*y0 ;
    if (obj == "erase") {
        ctx.clearRect(x,y,x0,y0) ;
        return ;
    }
    ctx.fillStyle = obj.color ;
    ctx.fillRect(x,y,x0,y0) ;
}

Array.prototype.containsArray = function(val) {
    var hash = {};
        for(var i=0; i<this.length; i++) {
            hash[this[i]] = i;
        }
    return hash.hasOwnProperty(val);
}
let snake = {
    name : "snake" ,
    life : true ,
    color : "#00ff00" ,
    head : [] ,
    new_head : function() {
        let heady = this.body[this.body.length-1] ;
        this.head = [heady[0],heady[1]] ;
        switch (direction) {
            case "up" :
                this.head[1] -= 1 ;
                break ;
            case "left" :
                this.head[0] -= 1 ;
                break ;
            case "down" :
                this.head[1] += 1 ;
                break ;
            case "right" :
                this.head[0] += 1 ;
                break ;
        }
        return this.head ;
    } ,
    is_alive : function(first) {
        console.log("is alive?")
        return !(this.body.containsArray(first)) && this.head[0] >= 0 && this.head[0] < ws && this.head[1] >= 0 && this.head[1] < hs  ;
    } ,
    update : function() { // add head -> check dead -> check eat
        new_head = this.new_head() ;
        let head = this.body[this.body.length-1] ;
        if (this.is_alive(new_head)) {
            console.log("alive")
            this.body.push(new_head) ;
            fill(new_head, this) ;
        } else {
            this.life = false ;
            alert("body length: "+ this.body.length) ;
            return ;
        } ;
        console.log("snake.head: ", this.head) ;
        console.log("apple.position: ", apple.position) ;
        console.log(this.head[0] === apple.position[0]) ;
        console.log(this.head[1] === apple.position[1]) ;
        if ((this.head[0] == apple.position[0]) && (this.head[1] == apple.position[1])) {
            console.log("apple eaten")
            apple.update() ;
            return ;
        } else {
            console.log("apple not eaten")
            fill(this.body.shift(), "erase") ;
        } ;
    } ,
    body : [] ,
    init : [1,1]
}

let apple = {
    name : "apple" ,
    color : "#ff0000" ,
    position : [0,0] ,
    AppleNotInSnake : function() {
        if (snake.body.containsArray(this.position)){ return true ; }
        return false ;
    } ,
    update : function() { // when eaten by snake
        do {
            this.position[0] = Math.floor(Math.random() * ws)
            this.position[1] = Math.floor(Math.random() * hs)
        } while (this.AppleNotInSnake()) ;
        console.log("apple position:, ", this.position)
        fill(this.position, this) ;
    }
}

// start movement

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
const dt = 250 ;
snake.body = [snake.init] ;
fill(snake.init)
apple.update() ;
async function start_snake() {
    while (snake.life && !(pause)) {
        snake.update() ;
        await sleep(dt) ;
    }
}
start_snake()
