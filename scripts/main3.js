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
let pause = true ;
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
    new_head : function() {
        console.log("new head activated, body = ", this.body) ;
        head = this.body[this.body.length-1] ;
        console.log("head: ",head)
        switch (direction) {
            case "up" :
                head[1] -= 1 ;
                break ;
            case "left" :
                head[0] -= 1 ;
                break ;
            case "down" :
                head[1] += 1 ;
                break ;
            case "right" :
                head[0] += 1 ;
                break ;
        }
        return head ;
    } ,
    is_alive : function(first) {
        console.log("is alive?")
        console.log("body : ", this.body)
        console.log(first)
        return !(this.body.containsArray(first)) ;
    } ,
    update : function() { // add head -> check dead -> check eat
        console.log("update func activated!")
        new_head = this.new_head() ;
        console.log("new head: ", new_head)
        console.log("body : ", this.body)
        if (this.is_alive(new_head)) {
            console.log("alive")
            this.body.push(new_head) ;
            fill(new_head, this) ;
        } else {
            this.life = false ;
            console.log("body length: ", this.body.length)
            alert("body length: "+ this.body.length) ;
            return ;
        }
        if (new_head == [apple.x , apple.y]) {
            return ;
        }
        else {
            fill(this.body.shift(), "erase") ;
        }
    } ,
    body : [[0,0]]
}
console.log("snake body: ", snake.body)

let apple = {
    name : "apple" ,
    color : "#ff0000" ,
    x : 0 ,
    y : 0 ,
    AppleNotInSnake : function() {
        if (snake.body.find((a) => {return a == [this.x, this.y]})) { return true ; }
        return false ;
    } ,
    update : function() { // when eaten by snake
        do {
            this.x = Math.floor(Math.random() * ws)
            this.y = Math.floor(Math.random() * hs)
        } while (this.AppleNotInSnake()) ;
        console.log("apple x,y : ", this.x, this.y) ;
    }
}

// start movement
function fill(p, obj=snake) {
    let x = p[0]*x0 ;
    let y = p[0]*y0 ;
    if (obj == "erase") {
        ctx.clearRect(x,y,x0,y0) ;
        return ;
    }
    ctx.fillStyle = obj.color ;
    ctx.fillRect(x,y,x0,y0) ;
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
const dt = 500 ;
// snake.body = [[0,0]] ;
console.log("snake body: ", snake.body)
apple.update() ;
async function start_snake() {
    console.log(!pause) ;
    while (snake.life && !(pause)) {
        await sleep(dt) ;
        console.log("snake body: ", snake.body)
        snake.update() ;
    }
}
start_snake()
