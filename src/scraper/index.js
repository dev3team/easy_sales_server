const {io} = require('socket.io-client');
const PORT = process.env.PORT
const socket = io(`ws://localhost:${PORT}`);
const { Worker } = require('worker_threads');

const runService = (workerData, path) => {
	return new Promise((resolve, reject) => {
	  const worker = new Worker(path, {workerData});
	  worker.on('message', resolve);
	  worker.on('error', reject);
	  worker.on('exit', (code) => {
		if (code !== 0)
		  reject(new Error(`Worker stopped with exit code ${code}`));
	  });
  })
}

const scraper = async() => {
	
	socket.on('connect', () => {
		socket.emit('init', 'scraper');
	})

	socket.on('scrape jobs', async(jobs) => {
		const result = await runService(jobs, './src/scraper/workers/workerParser.js');
		socket.emit('parsed jobs', result)
	})

	socket.on('apply job', async(data) => {
		const result = await runService(data, './src/scraper/workers/workerBid.js');
		socket.emit("bid details", result);
	});

	socket.on('set bid', async(data) => {
		const result = await runService(data, './src/scraper/workers/workerSetBid.js');
		socket.emit("alert", result);
	})
}

module.exports = scraper;


