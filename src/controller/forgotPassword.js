import crypto from 'node:crypto';

import jwt from 'jsonwebtoken';

import User from '../model/user.js';
import { sendEmail } from '../lib/util/email.js';

const forgotPassword = async (req, res) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return res.status(404).json({
			message: 'Please double-check your email and try again.',
		});
	}

	const resetCode = user.generateResetCode();
	await user.save({ validateBeforeSave: false });

	try {
		const message = `Hi ${user.username}, \nWe received a request to reset the password on your JobTal Account. ${resetCode} \nIf you didn't forget your password, please ignore this email! \n The JobTal Team`;

		await sendEmail({
			email: user.email,
			subject: `${user.username}, here's your PIN ${resetCode}`,
			message,
		});
	} catch (err) {
		user.passwordResetCode = undefined;
		user.passwordResetExpired = undefined;
		user.passwordResetVerifyed = undefined;
		await user.save({ validateBeforeSave: false });

		return res.status(500).json({
			status: 'error',
			message: 'There was an error while sending the email',
		});
	}

	res.status(200).json({
		status: 'success',
		message: 'Reset code send to your email successfully',
	});
};

const verifyResetCode = async (req, res) => {
	const hashedResetCode = crypto
		.Hash('sha256')
		.update(req.body.resetCode)
		.digest('hex');

	const user = await User.findOne({
		passwordResetCode: hashedResetCode,
		passwordResetExpired: { $gt: Date.now() },
	});

	if (!user) {
		return res.status(400).json({ message: 'Invalid reset code or expired' });
	}

	user.passwordResetVerifyed = true;
	await user.save({ validateBeforeSave: false });
	res.status(200).json({ status: 'success' });
};

const resetPassword = async (req, res) => {
	if (req.body.password !== req.body.confirmPassword) {
		return res.send({ status: 400, message: 'Passwords do not match' });
	}

	try {
		const user = await User.findOneAndUpdate(
			{ email: req.body.email },
			{
				password: req.body.password,
			},
			{ new: true },
		);

		user.passwordResetCode = undefined;
		user.passwordResetExpired = undefined;
		user.passwordResetVerifyed = undefined;
		await user.save();

		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
			expiresIn: '2 years',
		});

		const loggedinUser = await User.findOneAndUpdate(
			{ email: req.body.email },
			{ lastLogin: Date.now() },
			{ new: true },
		).select('-password');

		res.send({
			status: 200,
			token,
			loggedinUser,
			message: 'Login successful',
		});
	} catch (err) {
		if (err.name === 'ValidationError' && err.errors.password) {
			return res.status(400).send({
				status: 400,
				message:
					'Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character',
			});
		}
	}
};

export { forgotPassword, verifyResetCode, resetPassword };
