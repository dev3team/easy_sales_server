const puppeteerExtra = require('puppeteer-extra');
const {executablePath} = require('puppeteer');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
 
const startBrowser = async () => {
    let extraBrowser;
	try {
	    console.log("Opening the browser......");
	    puppeteerExtra.use(StealthPlugin())
	    extraBrowser = await puppeteerExtra.launch({ 
			headless: true, 
			// args : [
			// '--window-size=1920,1080',
			// ], 
			executablePath: executablePath() 
		});
	} catch (err) {
	    console.log("Could not create a browser instance => : ", err);
	}
	return extraBrowser;
}

module.exports = {
    startBrowser
}