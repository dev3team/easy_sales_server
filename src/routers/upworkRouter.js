const { Router } = require('express');
const { makeCall } = require('../helpers');

const upwork = require('../controllers/upworkController');
const router = Router();

router.get('/jobs', (req, res) => makeCall(req, res, upwork.getJob));
router.get('/parsed-jobs', (req, res) => makeCall(req, res, upwork.getParsedJobs));
router.get('/filtered-jobs', (req, res) => makeCall(req, res, upwork.getFilteredJobs));
router.get('/jobsprofile/:id', (req, res) => makeCall(req, res, upwork.getJobProfile));
router.get('/authorization', (req, res) => makeCall(req, res, upwork.getAuthorization));
router.post('/verifier', (req, res) => makeCall(req, res, upwork.setVerifier));
router.post('/auth', (req, res) => makeCall(req, res, upwork.saveToken))


// TODO route for getting saved in DB jobs !!!

// router.post('/firebase-auth', (req, res) => makeCall(req, res, upwork.firebaseAuth));

module.exports = router;
