import jwt from 'jsonwebtoken';
import User from '../model/user.js';
import * as dotenv from 'dotenv';
dotenv.config();

const secureRoute = async (req, res, next) => {
	try {
		const authToken = req.headers.authorization;
		if (!authToken || !authToken.startsWith('Bearer')) {
			return res.status(401).send({
				message:
					'Unauthorized, you have to register or log in if you already have an account',
			});
		}
		const token = authToken.replace('Bearer ', '');
		jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, data) => {
			if (err) {
				return res.status(401).send({
					message:
						'Unauthorized, invalid login session, please log in and try again',
				});
			}
			const user = await User.findById(data.userId);
			if (!user) {
				return res.status(401).send({
					message:
						"Unauthorized, Please login or register if you don't have an account",
				});
			}
			req.currentUser = user;
			next();
		});
	} catch (err) {
		res.status(401).send({ message: 'Unauthorized' });
	}
};

const adminRoute = async (req, res, next) => {
	try {
		const authToken = req.headers.authorization;
		if (!authToken || !authToken.startsWith('Bearer')) {
			return res
				.status(401)
				.send({ message: 'Unauthorized, no token was provided' });
		}
		const token = authToken.replace('Bearer ', '');
		jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, data) => {
			if (err) {
				return res.status(401).send({ message: 'Unauthorized, invalid token' });
			}
			const user = await User.findById(data.userId);
			if (!user) {
				return res
					.status(401)
					.send({ message: 'Unauthorized, user not found' });
			}
			if (!user.isAdmin) {
				return res.status(401).send({ message: 'Unauthorized' });
			}
			req.currentUser = user;
			next();
		});
	} catch (err) {
		res.status(401).send({ message: 'Unauthorized' });
	}
};
export { secureRoute, adminRoute };
