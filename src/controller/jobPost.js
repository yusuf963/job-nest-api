import JobPost from '../model/jobPost.js';
import { APIError, HttpStatusCode } from '../lib/util/errorHandler.js';

const retriveJobPostsResourceFromDB = async () => {
	try {
		const jobPosts = await JobPost.find({ isHidden: false })
			.populate({ path: 'jobPostOwner', select: '-password' })
			.exec();
		return jobPosts;
	} catch (error) {
		throw new APIError(
			'NOT FOUND',
			HttpStatusCode.NOT_FOUND,
			true,
			'Something went wrong while retriving resource from DB',
		);
	}
};

const handelGetAllJobs = async (_req, res, next) => {
	try {
		const allJobs = await retriveJobPostsResourceFromDB();
		if (allJobs) return res.status(200).json({ allJobs, status: 'succeed' });
	} catch (error) {
		res.status(500).json({ status: 'failed' });
		next();
	}
};

const retriveSignleJobPostResourceFromDB = async (jobPostId) => {
	try {
		const jobPost = await JobPost.find({ isHidden: false, _id: jobPostId })
			.populate('jobPostOwner')
			.exec();
		return jobPost;
	} catch (error) {
		throw new APIError(
			'NOT FOUND',
			HttpStatusCode.NOT_FOUND,
			true,
			'Something went wrong while retriving resource from DB',
		);
	}
};

const handelGetSingleJob = async (req, res, next) => {
	const jobPostId = req.param.id;
	try {
		const singleJobPost = retriveSignleJobPostResourceFromDB(jobPostId);
		if (singleJobPost)
			return res.status(200).json({ singleJobPost, status: 'succeed' });
	} catch (error) {
		res.status(500).json({ status: 'failed' });
		next();
	}
};

const createJobPost = async (req) => {
	const {
		title,
		jobPostOwner,
		workplaceType,
		jobType,
		location,
		description,
		requirements,
		responsibilities,
	} = req.body;
	try {
		const jobPost = {
			title,
			jobPostOwner,
			workplaceType,
			jobType,
			location,
			description,
			requirements,
			responsibilities,
		};
		const createdJobPost = await JobPost.create(jobPost);
		return createdJobPost;
	} catch (error) {
		throw new APIError(
			'NOT FOUND',
			HttpStatusCode.NOT_FOUND,
			true,
			'Something went wrong while retriving resource from DB',
		);
	}
};
const handelCreateJobPost = async (req, res, next) => {
	try {
		const createdJobPost = await createJobPost(req);
		if (createdJobPost)
			return res.status(202).send({ createdJobPost, status: 'succeed' });
	} catch (error) {
		res.status(500).json({ status: 'failed' });
		next();
	}
};

const handelUpdateJobPost = async (req, res, next) => {};

const handelDeleteJobPost = async (req, res, next) => {};

export {
	handelGetAllJobs,
	handelGetSingleJob,
	handelCreateJobPost,
	handelUpdateJobPost,
	handelDeleteJobPost,
};
