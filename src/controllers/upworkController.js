const UpworkApi = require('upwork-api');
const Search = require('upwork-api/lib/routers/jobs/search.js').Search;
const path = require('path')
const fs = require('fs');
const { upworkScore, DbJobsToRes, detailJob } = require('../helpers');
const Profile = require('upwork-api/lib/routers/jobs/profile.js').Profile;
const ParsedJobsModel = require('../db/Models/ParsedJobsModel');
const JobsModel = require('../db/Models/JobsModel');
const UserModel = require('../db/Models/UserModel');
// const db = require('./../db');

const { env: { PORT }} = process;

let isAccess = false;

const callbackUrl = `localhost:${PORT}/verifier`;

const accessParams = {
  accessToken: '1d0a04d9117d2b7219f475b36013bf36',
  accessTokenSecret: 'b4250c719af2c904',
};

const config = {
  consumerKey: '8226d9737d102292b38a7bddcb3f66a3',
  consumerSecret: 'bbad9b19508e4bb4',
};

let api;

const saveOptions = fs.readFileSync(path.resolve(__dirname + '../../options.json'),'utf8');

try {
  
  accessParams.accessToken = JSON.parse(saveOptions).accessToken;
  accessParams.accessTokenSecret = JSON.parse(saveOptions).accessTokenSecret;
  config.consumerKey = JSON.parse(saveOptions).consumerKey;
  config.consumerSecret = JSON.parse(saveOptions).consumerSecret;
  api = new UpworkApi(config);
} catch (err) {
  console.log('Error parsing option JSON', err);
}

const upwork = {
	getJob: async (data, res) => {
		const { q = '', title = '', skills = '', min_score = '' } = data;
		const paramsSearch = {'q': q, 'title' : title, 'skills' : skills, 'paging': '0;50', 'category2': '531770282580668418' }; // paging how match jobs we need to get

		if (!isAccess) {
		upwork.setAccessToken();
		isAccess = true;
		}

		const jobs = new Search(api);

		await jobs.find(paramsSearch, function (error, data) {
		if (error) {
			res.status(400).send(error);
		}
		//  res.status(200).send(upworkScore(data, min_score));
		// d = data.jobs.filter(item => item.job_type == "Hourly" && item.budget != 0)
		res.status(200).send(data.jobs)
		});
	},

	getParsedJobs: async (data, res) => {
		const QUANTITY_MAX = 8;
		const skip = +data.skip + QUANTITY_MAX;

		const doc = await ParsedJobsModel.findOne();
		const currentLength = doc.parsed.length;

		const quantity = (currentLength - skip < 0 ) ? currentLength%QUANTITY_MAX : QUANTITY_MAX;
		let isListEnd = (currentLength - skip < 0) ? true : false;

		const parsedDoc = await ParsedJobsModel.findOne({}, {parsed: {$slice: [-skip, quantity] }});
		const jobs = parsedDoc.parsed.reverse()
		
		res.status(200).json({jobs, isListEnd})
	},
	getJobProfile: async (data, res) => {
		const jobId = data.params.id;
		const jobsDoc = await JobsModel.findOne();
		const job = jobsDoc.jobs.find(job => job?.id == jobId);

    const parsedJobDoc = await ParsedJobsModel.findOne();
    const parsedJob = parsedJobDoc.parsed.find(job => job?.id == jobId)
		res.status(200).json({job: job, parsed: parsedJob})
	},

  // getFilteredJobs: async (data, res) => {
  //   let savedJobs = null;
  //   let error = null;

  //   const { page = '', only_new = false } = data;

  //   db.init();
  //   try {
  //     if (only_new) {
  //       if (page) {
  //         savedJobs = await db.query(`SELECT * FROM ${db.tableName} WHERE status=0 ORDER BY date DESC OFFSET ${(page - 1) * 50} LIMIT 50`);
  //       } else {
  //         savedJobs = await db.query(`SELECT * FROM ${db.tableName} WHERE status=0 ORDER BY date DESC`);
  //       }
  //     } else {
  //       if (page) {
  //         savedJobs = await db.query(`SELECT * FROM ${db.tableName} ORDER BY date DESC OFFSET ${(page - 1) * 50} LIMIT 50`);
  //       } else {
  //         savedJobs = await db.query(`SELECT * FROM ${db.tableName} ORDER BY date DESC`);
  //       }
  //     }

  //   } catch (err) {
  //     console.error(err);
  //     error = err;
  //   }
  //   db.close();

  //   if (error) {
  //       res.status(400).send(error);
  //   } else {
  //       res.status(200).send(DbJobsToRes(savedJobs));
  //   }
  // },

  // getJobProfile: async (data, res) => {
  //   if (!isAccess) {
  //     upwork.setAccessToken();
  //     isAccess = true;
  //   }

  //   var profile = new Profile(api);
  //   console.log('controller', data)
  //   const resData = detailJob(profile, data.params.id);
  //   console.log(profile)
  //   // res.status(200).send(resData);

  // },

  getAuthorization: async (data, res) => {
    const { requestToken, requestTokenSecret } = data;
    if ( api === undefined ) {
      api = new UpworkApi({
        consumerKey: requestToken,
        consumerSecret: requestTokenSecret,
      });

      config.consumerKey = requestToken;
      config.consumerSecret = requestTokenSecret;

      const options = JSON.stringify(config);
      fs.writeFile('./options.json', options, (err) => {
        if ( err ) {
          console.log('Error saving options data.', err.message);
          return;
        }
        console.log('Data saved success.')
      })
    }

    api.getAuthorizationUrl(callbackUrl, function (error, url, requestToken, requestTokenSecret) {
      if ( error ) throw new Error('can not get authorization url, error: ' + error);
      res.status(200).send(url);
    });
  },

  setAccessToken: async () => {
    api.setAccessToken(accessParams.accessToken , accessParams.accessTokenSecret, ()=>{});
  },

  setVerifier: async (data) => {
    const { requestToken, requestTokenSecret, verifier } = data;
    api.getAccessToken(requestToken, requestTokenSecret, verifier, function (error, accessToken, accessTokenSecret) {
      console.log('Get Access Token Error: ', error)
      if ( error ) throw new Error(error);

      console.log('Access Token: ', accessToken) //1d0a04d9117d2b7219f475b36013bf36
      console.log('Access Token Secret: ', accessTokenSecret) //b4250c719af2c904

      accessParams.accessToken = accessToken;
      accessParams.accessTokenSecret = accessTokenSecret;

      const options = JSON.stringify(accessParams);
      fs.writeFile('./options.json', options, (err) => {
        if ( err ) {
          console.log('Error saving options data.', err.message);
          return;
        }
        console.log('Data saved success.')
      })
      // Here you can store access token in safe place
    });
  },
  saveToken: async (data, res) => {
    console.log(data, 'data');
    const {userId, email, token} = data
    const admin = await UserModel.findOne({userId});
    if (admin){
      await UserModel.findOneAndUpdate({userId}, {userId, email, token})
    } else {
      const user = new UserModel({userId, email, token})
      await user.save();
    }
    
  }

  // firebaseAuth: async (data, res) => {
  //   console.log(data);

  //   const { userId = '', email = '', token = '' } = data;

  //   if (userId && email && token) {
  //     db.init();

  //     console.log('SAVING FIREBASE TOKEN !!!');

  //     let saved = false;

  //     try {
  //       let currUser = await db.query(`SELECT * from ${db.tokensTableName} WHERE user_id="${userId}"`);

  //       if (currUser.length) {
  //         saved = await db.query(`UPDATE ${db.tokensTableName} SET token="${token}" WHERE user_id="${userId}"`);
  //       } else {
  //         saved = await db.query(`INSERT INTO ${db.tokensTableName} (user_id, email, token) VALUES ("${userId}", "${email}", "${token}")`);
  //       }
  //     } catch (err) {
  //       console.error(err);
  //       res.status(500).send(err);
  //     }

  //     console.log('saved: ', saved);
  //     if (saved !== false) {
  //       res.status(500).send(saved);
  //     } else {
  //       res.status(200).send();
  //     }

  //   } else {
  //     res.status(404).send({error: 'Missing data !!!'});
  //   }
  // },
};

module.exports = upwork;
