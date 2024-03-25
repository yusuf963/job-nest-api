import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import helmet from 'helmet';
import cors from 'cors';

import connectToDb from './lib/dbConnector.js';
import routes from './view/index.js';

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

app.listen(port, () => {
	// eslint-disable-next-line
	console.log(`Server is running on port ${port} 🚀......`);
});
