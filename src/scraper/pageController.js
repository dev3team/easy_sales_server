const scraperController = require('./scraperController')

const scrapeClusterController = async (cluster, jobs) => {
    try {
        await cluster.task(scraperController.scrapePage);
        const parsedJobs = await Promise.all(jobs.map(async(job) => {
            const data = await cluster.execute(job);
            return data
        }))
        await cluster.idle()
        await cluster.close()
        const sortedParsedJobs = parsedJobs.sort((a,b) => a?.parsing_completion_time - b?.parsing_completion_time)
        return sortedParsedJobs;
        // const filterJobs = parsedJobs.filter(job => job.status === 'fulfilled');
        // return parsedJobs.map(job => job.value)
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = scrapeClusterController;