import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();
const dbURI =
	process.env.DB_URI ||
	`mongodb+srv://${process.env.JOBTAL_DB_USERNAME}:${process.env.JOBTAL_DB_PASSWORD}@job-next-cluster.jtaevla.mongodb.net/jobtal?retryWrites=true&w=majority&appName=job-next-cluster`;
const connectToDb = () => {
	const clientOptions = {
		serverApi: { version: '1', strict: true, deprecationErrors: true },
	};

	try {
		return mongoose.connect(dbURI, clientOptions);
	} catch (error) {
		throw new Error(error);
	}
};

export default connectToDb;
