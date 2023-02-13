const {Schema, model} = require('mongoose');

const JobSchema = new Schema({
    id: String,
    title: String, 
    snippet: String,
    category2: String, 
    subcategory2: String,
    skills: [String],
    job_type: String ,
    budget: Number,
    duration: String,
    workload: String,
    job_status: String,
    date_created: String,
    publish_time: String,
    url: String,
    client: {
        country: String,
        feedback: Number,
        reviews_count: Number,
        jobs_posted: Number,
        past_hires: Number,
        payment_verification_status: String
    },
    renew_time: {type: String, default: null}
});

const JobsSchema = new Schema({
    jobs: [JobSchema]
})

module.exports = model('newJobs', JobsSchema);