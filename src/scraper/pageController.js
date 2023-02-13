const scrapePage = require('./scrapePage');

const scrapeClusterController = async (cluster, jobs) => {
    try {
        await cluster.task(scrapePage);
        const parsedJobs = await Promise.allSettled(jobs.map(async(job) => {
            const data = await cluster.execute(job);
            return data
        }))
        await cluster.idle()
        await cluster.close()
        const filterJobs = parsedJobs.filter(job => job.status === 'fulfilled');
        return parsedJobs.map(job => job.value)
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = scrapeClusterController;