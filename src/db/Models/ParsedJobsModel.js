const {Schema, model} = require('mongoose');

const ParsedJobSchema = new Schema({
    id: String,
    payment_verification_status: String,
    average_rating: Number, 
    reviews: Number,
    country: String, 
    city: String, 
    hire_rate: String,
    open_job: Number,
    client_total_spent: String,
    client_hires: Number,
    active: Number,
    avg_hourly_rate_paid: Number,
    hourly_rate: String,
    fixed_price: String,
    expertise: String,
    parsing_completion_time: Number
});

const ParsedJobsSchema = new Schema({
    parsed: [ParsedJobSchema]
})

module.exports = model('parsedJobs', ParsedJobsSchema);

