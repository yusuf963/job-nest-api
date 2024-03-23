import User from '../model/user.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
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

const registerUser = async (req, res, next) => {
	if (req.body.password !== req.body.confirmPassword) {
		return res.send({ status: 400, message: 'Passwords do not match' });
	}

	if (req.body.isAdmin) {
		delete req.body.isAdmin;
	}
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			return res
				.status(409)
				.send({ status: 409, message: 'User already exists' });
		}
		await User.create(req.body);

		const secret = process.env.JWT_SECRET_KEY;
		const newUser = await User.findOne({ email: req.body.email });
		const payload = {
			email: req.body.email,
			id: newUser._id,
		};
		const email = req.body.email;
		// const token = jwt.sign(payload, secret, { expiresIn: '72h' });
		// const link = `${CLIENT_BASE_URL}auth/verify-account/${newUser._id}/${token}`;
		// sendEmail(link, 'verifyAccountTemplate', email, 'Verify Account');

		return res.send({ status: 201, message: 'User has been created' });
	} catch (err) {
		if (err.name === 'ValidationError' && err.errors.username) {
			return res.status(400).send({
				status: 400,
				message: 'Username must be unique',
			});
		}
		if (err.name === 'ValidationError' && err.errors.password) {
			return res.status(400).send({
				status: 400,
				message:
					'password is shorter than the minimum allowed length (8) and must match',
			});
		}
		if (err.name === 'ValidationError') {
			return res.send({
				status: 400,
				message: 'something went wrong please check your details',
			});
		}
		next(err);
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

const updateUser = async (req, res, next) => {
	// TODO: write better logic for saving only the fields that are changed including updates_at and not change createdAt timeStamp in the db.
	const id = req.params.id;
	const currentUser = req.currentUser;
	const body = req.body;
	try {
		const userToUpdate = await User.findById(id);

		if (!userToUpdate) {
			return res.send({ message: 'No user found with that ID' });
		}

		if (!currentUser?.isAdmin && !userToUpdate._id.equals(currentUser._id)) {
			return res
				.status(401)
				.send({ message: 'Unauthorized you can not edit this profile' });
		}

		body.updatedAt = Date.now();
		await User.findByIdAndUpdate(id, body);
		const user = await User.findById(id);

		res.send(user);
	} catch (err) {
		next(err);
	}
};

const deleteUser = async (req, res, next) => {
	const id = req.params.id;
	const currentUser = req.currentUser;
	try {
		const userToDelete = await User.findById(id);
		if (!userToDelete)
			return res.send({ message: 'No user found with that ID' });
		if (!currentUser.isAdmin && !userToDelete._id.equals(currentUser._id)) {
			return res
				.status(401)
				.send({ message: 'Unauthorized you can not edit this profile' });
		}
		userToDelete.remove();
		res.send({
			message: 'User has been deleted',
			status: 'success',
		});
	} catch (error) {
		next(error);
	}
};

const getAllUsers = async (_req, res, next) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (err) {
		next(err);
	}
};

const getOneUser = async (req, res, next) => {
	const userId = req.params.id;
	try {
		const user = await User.find({ id: userId });
		user ? res.send(user) : next();
	} catch (err) {
		next(err);
	}
};

export {
	registerUser,
	loginUser,
	updateUser,
	deleteUser,
	getAllUsers,
	getOneUser,
	confirmUserVerification,
};
