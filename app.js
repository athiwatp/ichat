var express = require('express')
var app     = express()
var ejs     = require('ejs')
var io      = require('socket.io')()
app.engine('html', ejs.renderFile)
io.listen(app.listen(4000))
app.get('/', home)
function home(req, res) {
	res.render('index.html')
}

io.on("connection", client => {
	client.send("Welcome to iChat")
	client.on("message", m => {
		io.send(m)
	})
})

/*
chat
+-- app.js (this file)
+-- views
    +-- index.html

npm install express ejs socket.io
*/

