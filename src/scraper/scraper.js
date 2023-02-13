const SELECTOR_COUNTRY = 'ul.list-unstyled.cfe-ui-job-about-client-visitor.m-0-bottom li[data-qa="client-location"] > strong';
const SELECTOR_CITY = 'ul.list-unstyled.cfe-ui-job-about-client-visitor.m-0-bottom li[data-qa="client-location"] .text-muted span';
const SELECTOR_REVIEWS = 'div.cfe-ui-job-about-client > div.text-muted.rating.mb-20 > span';
const SELECTOR_HIRE_RATE = 'ul.list-unstyled.cfe-ui-job-about-client-visitor.m-0-bottom li[data-qa="client-job-posting-stats"] > div.text-muted';
const SELECTOR_CLIENT_SPENT = 'div.cfe-ui-job-about-client ul.list-unstyled.cfe-ui-job-about-client-visitor.m-0-bottom strong[data-qa="client-spend"] > span > span';
const SELECTRO_CLIENT_HIRES = 'div.cfe-ui-job-about-client ul.list-unstyled.cfe-ui-job-about-client-visitor.m-0-bottom div[data-qa="client-hires"]';
const SELECTOR_AVG_HOURLY_RATE_PAID = 'div.cfe-ui-job-about-client ul.list-unstyled.cfe-ui-job-about-client-visitor.m-0-bottom li strong[data-qa="client-hourly-rate"]';
const SELECTOR_HOURLY_RATE = '.up-card-section [data-cy="clock-timelog"] + strong';
const SELECTOR_FIXED_PRICE = '.up-card-section [data-cy="fixed-price"] + strong';
const SELECTOR_EXPERTISE = 'section.up-card-section ul.cfe-ui-job-features.p-0 li div.header div[data-cy="expertise"] + strong';

const scraper = {
    getReviews: async (page) => {
        const data = {average_rating: null, reviews: null}
        try {
            const value = await page.$eval(SELECTOR_REVIEWS, el => el.innerHTML);
            const arrReviews = value.split('of').map(str => +str.replace(/[^\d\.]*/g, ''));
            data.average_rating = arrReviews[0];
            data.reviews = arrReviews[1]
        } catch (error) {
            console.log(error.message)
        }
        return data
    },

    getClientLocation: async (page) => {
        const location = {country: null, city: null};
        try {
            const country = await page.$eval(SELECTOR_COUNTRY, el => el.innerHTML);
            location.country = country.trim();
            const city = await page.$eval(SELECTOR_CITY, el => el.innerHTML)
            location.city = city.trim();
        } catch (error) {
            console.log(error.message)
        }
        return location
    },

    getJobInfo: async (page) => {
        const data = {hire_rate: null, open_job: null}
        try {
            const value = await page.$eval(SELECTOR_HIRE_RATE, el => el.innerHTML);
            const arrOfValue = value.split('rate').map(str => +str.replace(/[^\d\.]*/g, ''));
            data.hire_rate = arrOfValue[0] + '%';
            data.open_job = arrOfValue[1];
        } catch (error) {
            console.log(error.message)
        }
        return data
    }, 

    getClientSpendInfo: async(page) => {
        try {
            const value = await page.$eval(SELECTOR_CLIENT_SPENT, el => el.innerHTML);
            return value.trim() || null
        } catch (error) {
            console.log(error.message);
            return null
        }
    },

    getClientHires: async(page) => {
        const data = {client_hires: null, active: null};
        try {
            const value = await page.$eval(SELECTRO_CLIENT_HIRES, el => el.innerHTML);
            const arrOfClientHires = value.split(',').map(str => +str.replace(/[^\d\.]*/g, ''));
            data.client_hires = arrOfClientHires[0];
            data.active = arrOfClientHires[1];
        } catch (error) {
            console.log(error.message);
        }
        return data
    },

    getAvgHourlyRatePaid: async(page) => {
        try {
            const value = await page.$eval(SELECTOR_AVG_HOURLY_RATE_PAID, el => el.textContent);
            return +value?.replace(/[^\d\.]*/g, '')
        } catch (error) {
            console.log(error.message);
            return null
        }
    },

    getHourlyRate: async (page) => {
        try {
            const value = await page.$eval(SELECTOR_HOURLY_RATE, el => el.textContent);
            return value.trim();
        } catch (error) {
            console.log(error.message);
            return null
        }
    },
    getFixedPrice: async (page) => {
        try {
            const value = await page.$eval(SELECTOR_FIXED_PRICE, el => el.textContent);
            return value.trim();
        } catch (error) {
            console.log(error.message);
            return null
        }
    },
    getExpertise: async (page) => {
        try {
            const value = await page.$eval(SELECTOR_EXPERTISE, el => el.textContent);
            return value.trim();
        } catch (error) {
            console.log(error.message);
            return null
        }
    }

};

module.exports = scraper;