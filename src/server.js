const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const http = require('http');
const { Server } = require("socket.io");

const upwork = require('./routers/upworkRouter');
const notification = require('./notification');
const ParsedJobsModel = require('./db/Models/ParsedJobsModel');
dotenv.config({ path: __dirname + './../.env' });

const server = async (port, callback) => {
	try {
		const app = express();
		const sockets = {};
		const server = http.createServer(app);
		const io = new Server(server);
		io.on('connection', function(socket) { 
			socket.on('create new user', () => {
				socket.join('parsed messages')
			})
			
			socket.on('disconnect', function () { 
			   console.log('Пользователь отключен'); 
			}); 

			socket.on('init', (name) => {
				sockets[name] = socket;
			})

			socket.on("new jobs", (jobs) => {
				console.log('new jobs')
				sockets.scraper.emit('scrape jobs', jobs)
			})

			socket.on("parsed jobs", async (parsedJobs) => {
				let parsedDoc = await ParsedJobsModel.findOne();
				if(!parsedDoc) parsedDoc = new ParsedJobsModel(); await parsedDoc.save();
				if (parsedJobs){
					parsedDoc.parsed.push(...parsedJobs)
					await parsedDoc.save();
					io.to('parsed messages').emit("new jobs", parsedJobs.reverse());
					notification.sendNotifications(parsedJobs)
				}
			})
		 });
		 
		
		app.use(express.json());
		app.use(cors());
		app.use('/', upwork);
		app.use((req, res, next) => {
			res.status(404).send({ data: { message: "Not Found" } });
		});
		mongoose.set("strictQuery", false);
		await mongoose.connect('mongodb+srv://dimabondarenko:12345@cluster0.immja2r.mongodb.net/?retryWrites=true&w=majority');
		server.listen(port, callback);
	} catch (error) {
		console.log(error);
	}
}

module.exports = server;
