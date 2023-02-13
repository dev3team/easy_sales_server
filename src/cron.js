const UpworkApi = require('upwork-api');
const Jobs = require('./db/Models/JobsModel');
const {io} = require('socket.io-client');
const socket = io("ws://localhost:3306");
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
        // const { q = '', title = '', skills = '', min_score = '' } = data;
        const paramsSearch = {'q': '', 'title' : '', 'skills' : '', 'paging': '0;30', 'category2': '531770282580668418' }; // paging how match jobs we need to get

        if (!isAccess) {
            upwork.setAccessToken();
            isAccess = true;
        }

        const jobs = new Search(api);
        
    await jobs.find(paramsSearch, async (error, data) => {
            
            if (!error) {
                // const resJobs = upworkScore(data, MINIMAL_SCORE);
                // await upwork.saveJobs(data.jobs)
                upwork.saveJobs(data.jobs)
            }
            
        });
    },
    setAccessToken: async () => {
        api.setAccessToken(accessParams.accessToken , accessParams.accessTokenSecret, ()=>{});
    },
    saveJobs: async (jobs) => {
        
        const jobsDoc = await Jobs.findOne(); // start 
        if (jobsDoc){      ///check an availability of a document
            let checkedJobs;
            const lastJobOfDB = jobsDoc.jobs[jobsDoc.jobs.length-1];
            const lastJobIndex = jobs.findIndex(item => item.id == lastJobOfDB.id); //find index last job of DB in new jobs 
            if (lastJobIndex < 0){
                checkedJobs = jobs;              
            } else {
                console.log(lastJobIndex)
                checkedJobs = jobs.slice(0, lastJobIndex);
            }

            console.log(checkedJobs.length, 'length')
            
            if (checkedJobs.length != 0){
                jobsDoc.jobs.push(...checkedJobs.reverse());
                await jobsDoc.save();
                upwork.sendToServer(checkedJobs)
                console.log('push')
            }

        } else {
            console.log('empty')
            const newJobs = new Jobs();
            newJobs.jobs.push(...jobs.reverse());
            await newJobs.save();
            upwork.sendToServer(jobs)
        }

    },
    sendToServer: (jobs) => {
        const clearedJobs = jobs.map((item) => {
            let {id, url, client: {payment_verification_status}, ...obj} = item;
            return {id, url, payment_verification_status}
        })
        socket.emit('new jobs', clearedJobs)
    }
};

// db.init();
// upwork.getJobs();
module.exports = upwork;

