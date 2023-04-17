const UserModel = require('./db/Models/UserModel');
const JobsModel = require('./db/Models/JobsModel');
const {sendMessageToUserDevice} = require('./lib/firebase');

const notification = {
    sendNotifications: async (jobs) => {
        try {
            const filteredJobs = jobs.filter(item => notification.checkJobForNotification(item));
            const users = await UserModel.find();
            users.forEach((user) => {
                filteredJobs.forEach(async (job) => {
                    const title = await notification.getJobInfomation(job.id);
                    sendMessageToUserDevice(title, `budget: ${job.fixed_price || job.hourly_rate}`, user.token, job.id);
                })
            
            })
        } catch (error) {
            console.log(error.message)
        }
        
    },
    getJobInfomation: async(jobId) => {
        try {
            const res = await JobsModel.findOne();
            
            const {title} = res.jobs.find(j => j.id == jobId)
            
            return title
        } catch (error) {
            console.log(error.message)
        }
        
    },
    checkJobForNotification: (job) => {
        const {expertise, payment_verification_status, fixed_price, hourly_rate, id} = job;
        if(expertise == 'Expert' && payment_verification_status == 'VERIFIED' && (+fixed_price?.replace(/[^\d\.]*/g, '') >= 1000 || +hourly_rate?.split('-')[1]?.replace(/[^\d\.]*/g, '') > 30 ) ) return id
    }
}


module.exports = notification;

