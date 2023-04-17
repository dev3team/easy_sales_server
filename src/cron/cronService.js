const UpworkApi = require('upwork-api');
const Jobs = require('../db/Models/JobsModel');
const {io} = require('socket.io-client');
const PORT = process.env.PORT
const socket = io(`ws://localhost:${PORT}`);
const ConnectMongoDB = require('../db/ConnectMongoDB')
socket.on('connect', () => {
    socket.emit('init', 'cron');
})

const Search = require('upwork-api/lib/routers/jobs/search.js').Search;
// const { upworkScore, addSlashes } = require('./helpers');
// const { sendMessageToUserDevice } = require('./lib/firebase');

const accessParams = {
    accessToken: '1d0a04d9117d2b7219f475b36013bf36',
    accessTokenSecret: 'b4250c719af2c904',
};

const config = {
    consumerKey: '8226d9737d102292b38a7bddcb3f66a3',
    consumerSecret: 'bbad9b19508e4bb4',
};

const MINIMAL_SCORE = 2;

let isAccess = false;

let api = new UpworkApi(config);


const upwork = {
    getJobs: async () => {
        const paramsSearch = {'q': '', 'title' : '', 'skills' : '', 'paging': '0;50', 'category2': '531770282580668418' }; // paging how match jobs we need to get
        if (!isAccess) {
            upwork.setAccessToken();
            isAccess = true;
        }
        const jobs = new Search(api);
        await jobs.find(paramsSearch, async (error, data) => {
            if (!error) {
                upwork.saveJobs(data.jobs)
            }
        });

    },
    
    setAccessToken: async () => {
        api.setAccessToken(accessParams.accessToken , accessParams.accessTokenSecret, ()=>{});
    },
    findDocument: async () => {
        await ConnectMongoDB();
        const jobsDoc = await Jobs.findOne();
        if(jobsDoc) return jobsDoc;
        const newJobsDoc = new Jobs();
        await newJobsDoc.save();
        return newJobsDoc;
    },
    filterNewJobs: (newJobs, document) => {
        const lastJobOfDB = document.jobs[document.jobs.length-1];
        if(!lastJobOfDB) return newJobs.slice(0, 20) // when we don't have jobs, return all jobs; db is empty

        
        const lastJobIndex = newJobs.findIndex(item => item.id === lastJobOfDB.id); //find index last job of DB in new jobs 
        if (lastJobIndex < 0) {
            const lastJob = document.jobs[document.jobs.length-2];
            const lastJobIx = newJobs.findIndex(item => item.id === lastJob.id);
            if (lastJobIx < 0) return newJobs.slice(0, 20)
            return newJobs.slice(0, lastJobIx);
        }
        return newJobs.slice(0, lastJobIndex);
    },
    saveJobs: async (jobs) => {
        await ConnectMongoDB()
        const jobsDoc = await upwork.findDocument();
        const filteredNewJobs = upwork.filterNewJobs(jobs, jobsDoc);
        if (filteredNewJobs.length != 0){
            jobsDoc.jobs.push(...filteredNewJobs.reverse());
            await jobsDoc.save();
            socket.emit('new jobs', filteredNewJobs) 
        }
    },
};

// db.init();
// upwork.getJobs();
module.exports = upwork;

