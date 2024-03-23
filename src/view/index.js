import express from 'express';
import { secureRoute, adminRoute } from '../lib/util/secureRoute.js';
import {
	registerUser,
	loginUser,
	updateUser,
	deleteUser,
	getAllUsers,
	getOneUser,
	confirmUserVerification,
} from '../controller/user.js';

import {
	handelGetAllJobs,
	handelGetSingleJob,
	handelCreateJobPost,
	handelUpdateJobPost,
	handelDeleteJobPost,
} from '../controller/jobPost.js';

import environment from '../lib/environment.js';

const router = express.Router();

router.route('/').get((req, res) => {
	res.sendFile('index.html', { root: '.' });
});

router
	.route('/job')
	.get((_req, res) =>
		res.send(
			'<h2 style="color: red; text-align: center;">Jobs route coming soon</h2>',
		),
	);

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/verify-account/:id/:token').get(confirmUserVerification);

router.route(environment.usersGetAll).get(adminRoute, getAllUsers);
router
	.route('/user/:id')
	.get(adminRoute, getOneUser)
	.put(secureRoute, updateUser)
	.delete(secureRoute, deleteUser);

router.route('/jobpost').get(handelGetAllJobs).post(handelCreateJobPost);
router
	.route('/jobpost/:id')
	.get(secureRoute, handelGetSingleJob)
	.put(secureRoute, handelUpdateJobPost)
	.delete(adminRoute, handelDeleteJobPost);

export default router;
