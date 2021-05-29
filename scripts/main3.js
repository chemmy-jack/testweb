$("nav").hide() ;
function draw_line(x1,y1,x2,y2) {
    ctx.fillStyle = line_color ;
    ctx.moveTo(x1,y1) ;
    ctx.lineTo(x2,y2) ;
    ctx.stroke() ;
}

function update_direction(key) {
    switch (key) {
        case "w" :
        case "ArrowUp" :
            if (direction == "down" || pause || !snake.life ) { return ; } ;
            direction = "up" ;
            break ;
        case "a" :
        case "ArrowLeft" :
            if (direction == "right" || pause || !snake.life ) { return ; } ;
            direction = "left" ;
            break ;
        case "s" :
        case "ArrowDown" :
            if (direction == "up" || pause || !snake.life ) { return ; } ;
            direction = "down" ;
            break ;
        case "d" :
        case "ArrowRight" :
            if (direction == "left" || pause || !snake.life ) { return ; } ;
            direction = "right" ;
            break ;
        case "p" :
        case " " :
            togglepause() ;
            break ;
        case "r" :
            restart() ;
            break ;
        case "," :
            turnl() ;
            break ;
        case "." :
            turnr() ;
            break ;
    }
    // console.log("direction:",direction) ;
}

function togglepause() {
    if (snake.life) {
        pause = !pause ;
        if (!pause) { start_snake() ; }
    }
}

function turnl() {turn(false)}
function turnr() {turn(true)}
function turn(is_right) {
    let direction_pool = ["up", "right", "down", "left"] ;
    let current_direction_index = direction_pool.indexOf(direction) + 1;
    direction_pool.push("up") ;
    direction_pool.unshift("left") ;
    if (is_right) { direction = direction_pool[current_direction_index + 1] }
    else { direction = direction_pool[current_direction_index - 1] }
}

function restart() {
    pause = true ;
    initiate_game() ;
    snake.life = true ;
}

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

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

const temp = $("#snake_canvas") ;
temp.css("border", "5px solid #000") ;
temp.css("width", "100%") ;
const snake_canvas = temp[0] ;
const ctx = snake_canvas.getContext("2d") ;
const w = 600 ;
const h = 600 ;
snake_canvas.width = w ;
snake_canvas.height = h ;
let line_color = "#777777" ;

let ws, hs, x0, y0, dt, pause ;

// create direction and keyboard listening
let direction = "right"

document.addEventListener('keydown', (event) => {
    update_direction(event.key) ;
}, false) ;

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
        // console.log("is alive?")
        return !(this.body.containsArray(first)) && this.head[0] >= 0 && this.head[0] < ws && this.head[1] >= 0 && this.head[1] < hs  ;
    } ,
    update : function() { // add head -> check dead -> check eat
        new_head = this.new_head() ;
        let head = this.body[this.body.length-1] ;
        if (this.is_alive(new_head)) {
            // console.log("alive")
            this.body.push(new_head) ;
            fill(new_head, this) ;
        } else {
            this.life = false ;
            pause = true ;
            // alert("body length: "+ this.body.length) ;
            return ;
        } ;
        // console.log("snake.head: ", this.head) ;
        // console.log("apple.position: ", apple.position) ;
        // console.log(this.head[0] === apple.position[0]) ;
        // console.log(this.head[1] === apple.position[1]) ;
        if ((this.head[0] == apple.position[0]) && (this.head[1] == apple.position[1])) {
            // console.log("apple eaten")
            $("#score > button").text(snake.body.length) ;
            apple.update() ;
            return ;
        } else {
            // console.log("apple not eaten")
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
        // console.log("apple position:, ", this.position)
        fill(this.position, this) ;
    }
}

// initial game
function initiate_game() {
    $("#score > button").text(snake.body.length) ;
    direction = "right" ,
    ctx.clearRect(0, 0, w, h) ;
    pause = true ;
    snake.body = [snake.init] ;
    fill(snake.init)
    apple.update() ;
}

const map = {
    changeto1 : function() { this.change(10) ; } ,
    changeto2 : function() { this.change(20) ; } ,
    changeto3 : function() { this.change(30) ; } ,
    change : function(side_length) {
        ws = side_length ;
        hs = side_length ;
        x0 = w/ws ;
        y0 = h/hs ;
        dt = (ws + hs) * 5 ;
        initiate_game() ;
    }
} ;
map.changeto2() ;


// create snake and apple



// start movement

async function start_snake() {
    while (snake.life && !(pause)) {
        snake.update() ;
        await sleep(dt) ;
    // stop when restart
    }
}
