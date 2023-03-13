const saveCookie = require('./utils/saveCookie');
const loadCookie = require('./utils/loadCookie');
const scraper = require('./scraper');
const compareUrl = require('./utils/compareUrl');

const user = {
    username: 'dm@dev-3.com',
    password: 'qazwsxedc123!',
    answer: 'barcelona'
}

const scraperController = {
    getBidData: async ({page, data: {url, jobType}}) => {
        await loadCookie(page);
        await page.goto(url , {waitUntil: 'domcontentloaded'});
        if (compareUrl(page.url(), url)){
            await scraper.login(page, user);
            await page.waitForNavigation({waitUntil: 'domcontentloaded'});
            await page.goto(url , {waitUntil: 'domcontentloaded'});
        }
        const isAvailable = await scraper.checkIsAvailableJob(page);
        if(!isAvailable) return {status: "job is not available"};
        await scraper.clickApply(page);
        // const terms = await scraper.getTerms(page, jobType);
        const isDurationQ = await scraper.getDurationQuestion(page);
        const jobQuestions = await scraper.getJobQuestions(page)
        // const additionalDetails = await scraper.checkAdditionalSection(page);
        const bids = await scraper.getBids(page);

        let data = {
            jobType,
            isDurationQ,
            jobQuestions,
            bids
        }
        
        await saveCookie(page)
        return data
    },
    setBidData: async({page, data: { url, bidData }}) => {
        await loadCookie(page);
        await page.goto(url , {waitUntil: 'domcontentloaded'});
        if (compareUrl(page.url(), url)){
            await scraper.login(page, user);
            await page.waitForNavigation({waitUntil: 'domcontentloaded'});
            await page.goto(url , {waitUntil: 'domcontentloaded'});
        }
       
        await scraper.clickApply(page);
        // if(bidData.team) await scraper.setTeam(page, bidData.team);
        // if(bidData.freelancer) await scraper.setFreelancer(page, bidData.freelancer);
        if(bidData.terms.type == 'hourly'){
            await scraper.setHourlyRate(page, bidData.terms.data);
        } else if (bidData.terms.type == 'fixed'){
            await scraper.setFixedPrice(page, bidData.terms.data);
        }
        if(bidData.duration) await scraper.setDuration(page, bidData.duration);
        if(bidData.cover) await scraper.setCoverLetter(page, bidData.cover);
        if(bidData.answers) await scraper.setAnswers(page, bidData.answers);
        if(bidData.connects) await scraper.setBids(page, bidData.connects);
        await scraper.submitProposal(page);
        const alert = await scraper.getSuccessAlert(page)
        
        await saveCookie(page);
        await page.waitForTimeout(10000)

        // console.log(url, 'url')
        // console.log(bidData.terms.data, 'bidData')
        return alert
    }
}




module.exports = scraperController;