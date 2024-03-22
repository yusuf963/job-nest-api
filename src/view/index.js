import express from 'express';
import passport from 'passport';

import {
	registerUser,
	loginUser,
	updateUser,
	deleteUser,
	getAllUsers,
	getOneUser,
	confirmUserVerification,
} from '../controller/user.js';

import { secureRoute, adminRoute } from '../lib/secureRoute.js';
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

router.route('/auth/google').get(
	passport.authenticate('google', {
		scope: ['profile', 'email'],
		session: false,
	}),
);
router.route('/auth/google/callback').get(
	passport.authenticate('google', {
		failureRedirect: '/login',
		successRedirect: '/',
		session: false,
	}),
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

export default router;
