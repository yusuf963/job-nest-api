import { APIError } from '../util/errorHandler.js';

const sendErrorForDev = (err, res) => {
	res.status(err.httpCode).json({
		name: err.name,
		error: err,
		message: err.message,
		stack: err.stack,
	});
};
const sendErrorForProd = (err, res) => {
	res.status(err.httpCode).json({
		name: err.name,
		message: err.message,
	});
};
const globalErrorHandler = (err, _req, res, next) => {
	const error = new APIError(
		err.name,
		err.httpCode,
		err.isOperational,
		err.message,
	);

	if (process.env.JOBTAL_ENV === 'development') {
		sendErrorForDev(error, res);
	}
	if (process.env.JOBTAL_ENV === 'production') {
		sendErrorForProd(error, res);
	}
	next();
};

export default globalErrorHandler;
