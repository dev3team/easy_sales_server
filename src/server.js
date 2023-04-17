const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const http = require('http');


const upwork = require('./routers/upworkRouter');
const socketService = require('./socketServer');
dotenv.config({ path: __dirname + './../.env' });

const server = async (port, callback) => {
	try {
		const app = express();
		
		const server = http.createServer(app);
		socketService(server);
		app.use(express.json());
		app.use(cors());
		app.use('/', upwork);
		app.use((req, res, next) => {
			res.status(404).send({ data: { message: "Not Found" } });
		});
		server.listen(port, callback);
	} catch (error) {
		console.log(error);
	}
}

module.exports = server;
