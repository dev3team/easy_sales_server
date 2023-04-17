const notification = require('./notification');
const ParsedJobsModel = require('./db/Models/ParsedJobsModel');
const ConnectMongoDB = require('./db/ConnectMongoDB');
const { Server } = require("socket.io");

const socketService = (server) => {
	const sockets = {};
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
			await ConnectMongoDB();
			let parsedDoc = await ParsedJobsModel.findOne();
			if(!parsedDoc) parsedDoc = new ParsedJobsModel(); await parsedDoc.save();
			if (parsedJobs){
				parsedDoc.parsed.push(...parsedJobs)
				await parsedDoc.save();
				console.log(parsedJobs.reverse().length, 'parse socket');
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
}

module.exports = socketService;