const {workerData, parentPort} = require('worker_threads');
const scraperController = require('./scraperController');
const clusterObject = require('./cluster');

const runWorker = async () => {
    const cluster = await clusterObject.startCluster();
    await cluster.task(scraperController.getBidData);
    const data = await cluster.execute(workerData);
    await cluster.idle()
    await cluster.close()   

    parentPort.postMessage(data)
} 


runWorker();