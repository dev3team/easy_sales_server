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
const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER } = process.env;

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
				sockets.scraper.emit('scrape jobs', jobs)
			})

			socket.on("parsed jobs", async (parsedJobs) => {
				let parsedDoc = await ParsedJobsModel.findOne();
				if(!parsedDoc) parsedDoc = new ParsedJobsModel(); await parsedDoc.save();
				if (parsedJobs){
					parsedDoc.parsed.push(...parsedJobs)
					await parsedDoc.save();
					console.log(parsedJobs.reverse().length, 'parse')
					io.to('parsed messages').emit("new jobs", parsedJobs);
					notification.sendNotifications(parsedJobs); 
				}
			})

			socket.on("apply job", (data) => {
				sockets.scraper.emit('apply job', data);
				sockets.scraper.once('bid details', (data) => {
					socket.emit('bid details', data)
				})
			})

			socket.on('set bid', (data) => {
				sockets.scraper.emit('set bid', data);
				sockets.scraper.once('alert', data => {
					socket.emit("alert", data)
				})
			})
		 });
		
		app.use(express.json());
		app.use(cors());
		app.use('/', upwork);
		app.use((req, res, next) => {
			res.status(404).send({ data: { message: "Not Found" } });
		});
		mongoose.set("strictQuery", false);
		await mongoose.connect(`mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
		server.listen(port, callback);
	} catch (error) {
		console.log(error);
	}
}

module.exports = server;
