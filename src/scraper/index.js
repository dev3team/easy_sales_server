const {io} = require('socket.io-client');
const socket = io("ws://localhost:3306");
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
const sliceArray = (array) => {
	const array_size = 10;
	const sliced_array = [];
	for (let i = 0; i <array.length; i += array_size) {
		sliced_array.push(array.slice(i, i + array_size));
	}
	return sliced_array
}

const scraper = async() => {
	
	socket.on('connect', () => {
		socket.emit('init', 'scraper');
	})

	socket.on('scrape jobs', async(jobs) => {
		console.log('got jobs')
		// const slicedJobs = sliceArray(jobs)
		const result = await runService(jobs, './src/scraper/workerParser.js');
		const sortedJobs = result.sort((a,b) => a?.parsing_completion_time - b?.parsing_completion_time)
		console.log(sortedJobs, 'parsed jobs are ready');
		socket.emit('parsed jobs', sortedJobs)
	})

	socket.on('apply job', async(data) => {
		
		const result = await runService(data, './src/scraper/workerBid.js');
		console.log(result);
		socket.emit("bid details", result);
	});

	socket.on('set bid', async(data) => {
		console.log(data, "socket.on 'set bid'")
		const result = await runService(data, './src/scraper/workerSetBid.js');
		console.log(result);
		socket.emit("alert", result);
	})
}
/// job with questions


module.exports = scraper;


