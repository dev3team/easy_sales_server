const { Cluster } = require('puppeteer-cluster');
const vanillaPuppeteer = require('puppeteer');
const {addExtra} = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
 
const startCluster = async () => {
    let cluster;
	try {
	    console.log("Opening the cluster......");
		const puppeteerExtra = addExtra(vanillaPuppeteer);
		puppeteerExtra.use(StealthPlugin())
	    cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            maxConcurrency: 3,
			puppeteer: puppeteerExtra,
			puppeteerOptions: {headless: true, args : [
				'--window-size=1920,1080',
			  ]},
			// timeout: 60000,
            // monitor: true
        });
	} catch (err) {
	    console.log("Could not create a cluster instance => : ", err);
	}
	return cluster;
    
}

module.exports = {
    startCluster
}