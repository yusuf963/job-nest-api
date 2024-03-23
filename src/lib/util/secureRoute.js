import jwt from 'jsonwebtoken';
import User from '../../model/user.js';

const authenticateRoute =
	({ isAdminRoute }) =>
	async (req, res, next) => {
		try {
			const authToken = req.headers.authorization;
			if (!authToken || !authToken.startsWith('Bearer')) {
				return res.status(401).send({
					message: 'Unauthorized, no token was provided',
				});
			}
			const token = authToken.replace('Bearer ', '');
			jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, data) => {
				if (err) {
					return res.status(401).send({
						message: 'Unauthorized, invalid token',
					});
				}
				const user = await User.findById(data.userId);
				if (!user) {
					return res.status(401).send({
						message:
							'Unauthorized, Please login or register if you do not have an account',
					});
				}
				if (isAdminRoute && !user.isAdmin) {
					return res.status(401).send({
						message:
							'Unauthorized, You do not have permission to access this resource',
					});
				}
				req.currentUser = user;
				next();
			});
		} catch (err) {
			res.status(401).send({
				message: 'Unauthorized',
			});
		}
	};

const secureRoute = authenticateRoute({ isAdminRoute: false });
const adminRoute = authenticateRoute({ isAdminRoute: true });

export { secureRoute, adminRoute };
