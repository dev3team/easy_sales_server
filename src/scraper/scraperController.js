const saveCookie = require('./utils/saveCookie');
const loadCookie = require('./utils/loadCookie');
const scraper = require('./scraper');
const compareUrl = require('./utils/compareUrl');

const user = {
    username: process.env.UPWORK_USERNAME,
    password: process.env.UPWORK_PASSWORD,
}

const scraperController = {
    scrapePage: async ({ page, data: {url, id, client: {payment_verification_status}} }) => {
        await loadCookie(page);
        await page.goto(url , {waitUntil: 'domcontentloaded'});
        if (compareUrl(page.url(), url)){
            await scraper.login(page, user);
            await page.waitForNavigation({waitUntil: 'domcontentloaded'});
            await page.goto(url , {waitUntil: 'domcontentloaded'});
        }
        const {average_rating, reviews} = await scraper.getReviews(page);
        const {country, city} = await scraper.getClientLocation(page);
        const {hire_rate, open_job} = await scraper.getJobInfo(page);
        const client_total_spent = await scraper.getClientSpendInfo(page);
        const {client_hires, active} = await scraper.getClientHires(page);
        const avg_hourly_rate_paid = await scraper.getAvgHourlyRatePaid(page);
        const hourly_rate = await scraper.getHourlyRate(page);
        const fixed_price = await scraper.getFixedPrice(page);
        const expertise = await scraper.getExpertise(page);
        await saveCookie(page)
        let data = {
            id,
            payment_verification_status,
            average_rating,
            reviews,
            country,
            city,
            hire_rate,
            open_job,
            client_total_spent,
            client_hires,
            active,
            avg_hourly_rate_paid,
            fixed_price,
            hourly_rate,
            expertise,
            parsing_completion_time: Date.now()
        }
        return data 
    },
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
        const connects = await scraper.checkAvailableConnects(page);
        await scraper.clickApply(page);
        await page.waitForNavigation({waitUntil: 'load'});
        const terms = await scraper.getTerms(page, jobType);
        const isDurationQ = await scraper.getDurationQuestion(page);
        const jobQuestions = await scraper.getJobQuestions(page);
        // const additionalDetails = await scraper.checkAdditionalSection(page);
        const bids = await scraper.getBids(page);

        let data = {
            terms,
            isDurationQ,
            jobQuestions,
            bids,
            connects
        }
        
        await saveCookie(page)
        return data
    },
    setBidData: async({page, data: { url, bidData }}) => {
        try {
            await loadCookie(page);
            await page.goto(url , {waitUntil: 'domcontentloaded'});
            if (compareUrl(page.url(), url)){
                await scraper.login(page, user);
                await page.waitForNavigation({waitUntil: 'domcontentloaded'});
                await page.goto(url , {waitUntil: 'domcontentloaded'});
            }
           
            await scraper.clickApply(page);
            await page.waitForNavigation({waitUntil: 'load'});
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
            const notification = await scraper.getSuccessNotification(page);
            
            await saveCookie(page);
            return notification
        } catch (error) {
            console.log(error.message);
        }

    }
}




module.exports = scraperController;