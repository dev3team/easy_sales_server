const {workerData, parentPort} = require('worker_threads');
const scrapeClusterController = require('./pageController'); 
const clusterObject = require('./cluster');

const runWorker = async () => {
    const cluster = await clusterObject.startCluster();
	const parsedJobs = await scrapeClusterController(cluster, workerData);
    parentPort.postMessage(parsedJobs)
} 


runWorker();