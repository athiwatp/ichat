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
	client.name = "Anonymous"
	client.send("Welcome to iChat")
	client.on("message", m => {
		if (m.startsWith("@name")) {
			var field = m.split(" ")
			io.send(client.name + " has renamed to " + field[1])
			client.name = field[1]
		} else if (m.startsWith("@join")) {
			var field = m.split(" ")
			client.join(field[1])
		} else if (m.startsWith("@leave")) {
			var field = m.split(" ")
			client.leave(field[1])
		} else if (m.startsWith("@group")) {
			var field = m.split(" ")
			var message = ""
			for (var i = 2; i < field.length; i++) {
				message += field[i]
			}
			io.to(field[1]).send(client.name + ": " + message)
		} else {
			io.send(client.name + ": " + m)
		}
	})
	client.on("disconnect", () => {
		io.send(client.name + " disconnected")
	})
})

/*
chat
+-- app.js (this file)
+-- views
    +-- index.html

npm install express ejs socket.io
*/

