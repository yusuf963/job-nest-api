import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import asyncHandler from 'express-async-handler';

import User from '../model/user.js';
import { APIError, HttpStatusCode } from '../lib/util/errorHandler.js';
import { sendEmail } from '../lib/util/email.js';

const callbackUrl =
	process.env.JOBTAL_ENV === 'development'
		? 'http://localhost:5000/auth/google/callback'
		: 'https://job-nest-api.onrender.com/auth/google/callback';

const configureGoogleAuth = () => {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: callbackUrl,
				scope: ['email', 'profile'],
			},
			(_accessToken, _refreshToken, profile, done) => {
				done(null, profile);
			},
		),
	);
};

const configurePassport = () => {
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			const user = await user.findById(id);
			done(null, user);
		} catch (err) {
			done(err, null);
		}
	});
};

configureGoogleAuth();
configurePassport();

const registerData = (req) => {
	return {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		isTermsAgreed: req.body.isTermsAgreed,
	};
};

const registerUser = asyncHandler(async (req, res, next) => {
	try {
		const newUser = await User.create(registerData(req));

		const token = generateVerificationToken(newUser);
		const verificationLink = generateVerificationLink(req, newUser._id, token);
		const emailContent = generateVerificationEmail(
			newUser.email,
			verificationLink,
		);

		await sendVerificationEmail(emailContent);

		return res
			.status(201)
			.json({ status: 'success', message: 'User created successfully' });
	} catch (error) {
		return next(
			new APIError(
				'INTERNAL SERVER',
				HttpStatusCode.INTERNAL_SERVER,
				true,
				'An error occurred during user registration',
			),
		);
	}
});

const generateVerificationToken = (user) => {
	const secret = process.env.JWT_SECRET_KEY;
	const expiresTime = process.env.JWT_EXPIRES_IN;
	const payload = {
		email: user.email,
		id: user._id,
	};
	return jwt.sign(payload, secret, { expiresIn: expiresTime });
};

const generateVerificationLink = (req, userId, token) => {
	return `${req.protocol}://${req.get('host')}/auth/verify-account/${userId}/${token}`;
};

const generateVerificationEmail = (email, verificationLink) => {
	return {
		email: email,
		subject: 'Verify Your Account',
		message: `Hi there, Thank you for registering! Please click the following link to verify your account:
                ${verificationLink} Verify Your Account`,
	};
};

const sendVerificationEmail = async (emailContent) => {
	try {
		await sendEmail(emailContent);
	} catch (error) {
		throw new Error('An error occurred while sending the verification email');
	}
};

const confirmUserVerification = async (req, res, next) => {
	const token = req.params.token;
	const id = req.params.id;
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const user = await User.findById(id);
		if (user.isVerified) {
			return res.send({
				status: 200,
				message: 'User has already been verified',
			});
		}
		const updatedUser = await User.findOneAndUpdate(
			{ _id: payload.id },
			{ isVerified: true },
		);
		if (!updatedUser) {
			return res.status(404).send({ status: 404, message: 'User not found' });
		}
		res.send({ status: 200, message: 'congrats user has been verified' });
	} catch (err) {
		next(err);
	}
};

const loginUser = async (req, res, next) => {
	const password = req.body.password;
	try {
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res
				.status(401)
				.send({ status: 401, message: 'Please check your credentials' });
		}
		const isValidPassword = user.validatePassword(password);
		if (!isValidPassword) {
			return res.status(401).send({ status: 401, message: 'Unauthorized' });
		}
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
			expiresIn: '2 years',
		});
		const loggedinUser = await User.findOneAndUpdate(
			{ email: req.body.email },
			{ lastLogin: Date.now() },
			{ new: true },
		).select('-password');

		res.send({
			status: 202,
			token,
			loggedinUser,
			message: 'Login successful',
		});
	} catch (err) {
		next(err);
	}
};

const createUser = asyncHandler(async (req, res) => {
	const newUser = await User.create(registerData(req));
	return res.status(201).json({ status: 'success', newUser });
});

const updateUser = asyncHandler(async (req, res, next) => {
	const userToUpdate = await User.findByIdAndUpdate(
		req.params.id,
		{
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			username: req.body.username,
			email: req.body.email,
			phone: req.body.phone,
			address: req.body.address,
			updatedAt: Date.now(),
		},
		{ new: true },
	);

	if (!userToUpdate) {
		return next(
			new APIError(
				'NOT FOUND',
				HttpStatusCode.NOT_FOUND,
				true,
				'No user found with that ID',
			),
		);
	}

	return res.status(200).json({ status: 'success', updateUser });
});

const deleteUser = asyncHandler(async (req, res, next) => {
	const deletedUser = await User.findByIdAndDelete(req.params.id);

	if (!deletedUser) {
		return next(
			new APIError(
				'NOT FOUND',
				HttpStatusCode.NOT_FOUND,
				true,
				'No user found with that ID',
			),
		);
	}
	return res
		.status(204)
		.json({ status: 'success', message: 'User has been deleted' });
});

const getAllUsers = asyncHandler(async (_req, res) => {
	const users = await User.find({});
	return res
		.status(200)
		.json({ staust: 'success', results: users.length, users });
});

const getOneUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return next(
			new APIError(
				'NOT FOUND',
				HttpStatusCode.NOT_FOUND,
				true,
				'No user found with that ID',
			),
		);
	}

	return res.status(200).json({ stauts: 'success', user });
});

const getLoggedUserData = (req, _res, next) => {
	req.params.id = req.currentUser._id;
	next();
};

const updateLoggedUserData = asyncHandler(async (req, res, next) => {
	const userToUpdate = await User.findByIdAndUpdate(
		req.currentUser._id,
		{
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			username: req.body.username,
			email: req.body.email,
			phone: req.body.phone,
			address: req.body.address,
			updatedAt: Date.now(),
		},
		{ new: true },
	);

	if (!userToUpdate) {
		return next(
			new APIError(
				'NOT FOUND',
				HttpStatusCode.NOT_FOUND,
				true,
				'No user found with that ID',
			),
		);
	}

	return res.status(200).json({ status: 'success', userToUpdate });
});

export {
	registerUser,
	loginUser,
	createUser,
	updateUser,
	deleteUser,
	getAllUsers,
	getOneUser,
	confirmUserVerification,
	getLoggedUserData,
	updateLoggedUserData,
};
