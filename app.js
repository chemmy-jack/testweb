const http = require('http')
const fs = require('fs')
const port = 8000

// the function to call every time it recieves request
const server = http.createServer(function(req, res) {
    console.log('got a request!')
    res.writeHead(200, { 'Content-Type': 'text/html' })
    fs.readFile('index.html', function(error, data) {
        if (error) {
            res.writeHead(404)
            res.write('error: something in this server has gone wrong')
        } else {
            res.write(data)
        }
        res.end()
    })
})

// to set up the server to listen on the port
server.listen(port, function(error) {
    if (error) {
        console.log('Something went wrong', error)
    } else {
        console.log('Server is listening on port :' + port)
    }
})
