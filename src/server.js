import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

import connectToDb from './lib/dbConnector.js';
import routes from './view/index.js';

const app = express();
const port = process.env.PORT || 5000;

//Middlewares
app.use(helmet());
app.use(cors(), express.json());
app.use(bodyParser.json());
app.set('x-powered-by', false);
app.set('etag', false);
app.use(routes);

connectToDb();

app.listen(port, () => {
	// eslint-disable-next-line
	console.log(`Server is running on port ${port} 🚀......`);
});
