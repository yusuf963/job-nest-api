import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';

import connectToDb from './lib/dbConnector.js';
import routes from './view/index.js';
import globalError from './lib/middleware/globalError.js';
import { APIError, HttpStatusCode } from './lib/util/errorHandler.js';

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(helmet());
app.use(cors(), express.json());
app.use(bodyParser.json());
app.set('x-powered-by', false);
app.set('etag', false);
app.use(routes);

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	}),
);

app.use(passport.initialize());
app.use(passport.session());

connectToDb();

app.all('*', (req, _res, next) => {
	return next(
		new APIError(
			'BAD REQUEST',
			HttpStatusCode.BAD_REQUEST,
			true,
			`Can't find this ${req.originalUrl} route in the server`,
		),
	);
});

app.use(globalError);

app.listen(port, () => {
	// eslint-disable-next-line
	console.log(`Server is running on port ${port} 🚀......`);
});
