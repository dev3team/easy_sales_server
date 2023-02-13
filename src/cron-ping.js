const cron = require('node-cron');
const upwork = require('../src/cron');

const cronPing = async () => {
    cron.schedule("* * * * *", async() => {
        console.log('ping')
        upwork.getJobs();
    });
}

module.exports = cronPing;
