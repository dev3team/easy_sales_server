const {workerData, parentPort} = require('worker_threads');
const clusterObject = require('../cluster');
const scraperController = require('../scraperController')

const runWorker = async () => {
    const cluster = await clusterObject.startCluster();
    await cluster.task(scraperController.setBidData);
    const data = await cluster.execute(workerData);
    await cluster.idle()
    await cluster.close()   

    parentPort.postMessage(data)
} 


runWorker();