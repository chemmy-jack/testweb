const http = require('http')
const port = 8000

// the function to call every time it recieves request
const server = http.createServer(function(req, res) {
    console.log('got a request!')
    res.write('Hello Node')
    res.end()
})

// to set up the server to listen on the port
server.listen(port, function(error) {
    if (error) {
        console.log('Something went wrong', error)
    } else {
        console.log('Server is listening on port :' + port)
    }
})
