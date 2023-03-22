// client.country
const countryScore = {
    'Australia': 5,
    'Canada': 5,
    'France': 5,
    'United Kingdom': 5,
    'United States of America': 5,
    'Austria': 4,
    'Belgium': 4,
    'Chile': 4,
    'Iceland': 4,
    'Ireland': 4,
    'Luxembourg': 4,
    'Monaco': 4,
    'New Zealand': 4,
    'South Africa': 4,
    'Denmark': 3,
    'Finland': 3,
    'Germany': 3,
    'Italy': 3,
    'Norway': 3,
    'Spain': 3,
    'Sweden': 3,
    'Switzerland': 3,
    'Greece': 3,
    'Hungary': 3,
    'Israel': 2,
    'Latvia': 2,
    'Lithuania': 2,
    'Estonia': 2,
    'Malta': 2,
    'Netherlands': 2,
    'Poland': 1,
    'Romania': 1,
    'Slovakia': 1,
    'Slovenia': 1,
    'Turkey': 1,
    'United Arab Emirates': 1,
};

// client.past_hires
const hireHistory = (pastHires) => (
    (pastHires >= 10) ? 1.75 : ( (pastHires === 0) ? 1 : 1.5 )
);

// client.feedback
const clientRating = (feedback) => (
    (feedback === 5) ? 3 : ( (feedback < 3) ? 0.5 : 1 )
);


// const level = [
//   {
//     level: "Expert",
//     score: 3,
//   },
//   {
//     level: "Intermediate",
//     score: 2,
//   },
//   {
//     level: "Entry Level",
//     score: 1,
//   },
// ];

const addSlashes = (string) => {
  return string.replace(/\\/g, '\\\\')
    .replace(/\u0008/g, '\\b')
    .replace(/\t/g, '\\t')
    .replace(/\n/g, '\\n')
    .replace(/\f/g, '\\f')
    .replace(/\r/g, '\\r')
    .replace(/'/g, '\\\'')
    .replace(/"/g, '\\"');
};

const averageRate = [
  {
    rate:"0-10",
    score: 1,
  },
  {
    rate:"10-15",
    score: 2,
  },
  {
    rate:"15-20",
    score: 3,
  },
  {
    rate:"20-25",
    score: 8,
  },
  {
    rate:"25-30",
    score: 9,
  },
  {
    rate:"30+",
    score: 10,
  },
];

const prevReview = [
  {
    count: '0-3',
    score: 0,
  },
  {
    count: '3-4',
    score: 1,
  },
  {
    count: '4-4.5',
    score: 2,
  },
  {
    count: '4.6-4.9',
    score: 3,
  },
  {
    count: '5',
    score: 5,
  },
]; // change history params to moore adaptive


const makeCall = async (req, res, func) => {
	try {
    if(req.headers["access-key"] !== '13579') throw new Error('access denied');
		const data = req.method === 'GET' ? req.query : req.body;
		data.params = req.params || {};
		await func(data, res);

	} catch (error) {
		console.log(error);
		const { status = 500, message = "Bad request" } = error;
		res.status(status);
		res.send(message);
	}
};

const upworkScore = (data, minScore) => {
  const res = [];

  for (let job of data.jobs) {
    const cl = job.client;

    let cScore = countryScore.hasOwnProperty(cl.country) ? countryScore[cl.country] : 1;

    let totalScore = (
        cScore
        + hireHistory(cl.past_hires)
        + clientRating(cl.feedback)
    ) / 3;
    // ) / 6;

    if (!(minScore && totalScore < minScore)) {
        const newJob = {
            item: {
                client: job.client,
                job_status: job.job_status,
                date_created: job.date_created,
                workload: job.workload,
                skills: job.skills,
                snippet: job.snippet,
                url: job.url,
                title: job.title,
                averageScore: totalScore,
            }
        };

        // job.averageScore = totalScore;
        res.push(newJob);
    }
  }

  res.sort((a, b) => (b.item.averageScore - a.item.averageScore));

  return res;
};

const DbJobsToRes = (dbJobs) => {
  const arRes = [];

  if (dbJobs.length) {
    for (let job of dbJobs) {
        // TODO !!!
        // console.log('job.skills:  ', JSON.parse(job.skills));
      arRes.push({
        item: {
          client: {
            country: job.client_country,
            feedback: job.client_feedback,
            reviews_count: job.client_reviews,
            jobs_posted: job.client_jobs,
            past_hires: job.client_hires,
            payment_verification_status: job.client_status
          },
          job_status: job.job_status,
          date_created: job.date,
          workload: job.workload,
          skills: JSON.parse(job.skills),
          snippet: job.snippet,
          url: job.url,
          title: job.title,
          // averageScore: job.score,
        }
      });
    }
  }

  return arRes;
};

const structure = () => {
  let result = [];
  return function fullStructure (data, key = "") {
    if ( Array.isArray(data) ) {
      data.map(item => fullStructure(item))
      return;
    }
    if ( typeof data === "object" ) {
      for ( const key in data ) {
        fullStructure(data[key], key);
      }
      return;
    }
    result.push({key: data});
  }
};

const detailJob = (profile, id) => {
  console.log('detail')
  profile.getSpecific( id, function(error, data) {
    let result = structure();
    return result(data.profile);
  });
};

module.exports = { makeCall, upworkScore, DbJobsToRes, detailJob, addSlashes };

