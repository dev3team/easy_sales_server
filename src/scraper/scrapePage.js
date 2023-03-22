// const login = require('./utils/login');
const saveCookie = require('./utils/saveCookie');
const loadCookie = require('./utils/loadCookie');
const scraper = require('./scraper');
const compareUrl = require('./utils/compareUrl');


const user = {
    username: process.env.UPWORK_USERNAME,
    password: process.env.UPWORK_PASSWORD,
}

const scrapePage = async ({ page, data: {url, id, payment_verification_status} }) => {
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
}

module.exports = scrapePage;
