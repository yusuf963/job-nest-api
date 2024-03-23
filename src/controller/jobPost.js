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

const updateJobPostResourceFromDB = async (jobPostId) => {
	try {
		return await JobPost.findById(jobPostId);
	} catch (error) {
		throw new APIError(
			'NOT FOUND',
			HttpStatusCode.NOT_FOUND,
			true,
			'Something went wrong while retriving resource from DB',
		);
	}
};

const handelUpdateJobPost = async (req, res, next) => {
	const currentUser = req.currentUser;
	try {
		const jobPostToUpdate = await updateJobPostResourceFromDB(req.params.id);
		if (!jobPostToUpdate) {
			return res.send({ message: 'No job post found with that ID' });
		}
		if (
			!currentUser?.isAdmin &&
			!jobPostToUpdate.jobPostOwner.equals(currentUser._id)
		) {
			return res
				.status(401)
				.send({ message: 'Unauthorized you can not modify this job post' });
		}
		jobPostToUpdate.set(req.body);
		jobPostToUpdate.save();
		res.send(jobPostToUpdate);
	} catch (err) {
		next(err);
	}
};

const deleteJobPostResourceFromDB = async (jobPostId) => {
	try {
		return await JobPost.findById(jobPostId);
	} catch (error) {
		throw new APIError(
			'NOT FOUND',
			HttpStatusCode.NOT_FOUND,
			true,
			'Something went wrong while retriving resource from DB',
		);
	}
};
const handelDeleteJobPost = async (req, res, next) => {
	const currentUser = req.currentUser;

	try {
		const jobPostToDelete = await deleteJobPostResourceFromDB(req.params.id);
		if (!jobPostToDelete) {
			return res.send(`Job post with id ${req.params.id} not found`);
		}
		if (
			!currentUser?.isAdmin &&
			!jobPostToDelete.jobPostOwner._id.equals(currentUser._id)
		) {
			return res.status(401).send({ message: 'Unauthorized' });
		}
		jobPostToDelete.deleteOne();
		return res.send(jobPostToDelete);
	} catch (error) {
		next(error);
	}
};

export {
	handelGetAllJobs,
	handelGetSingleJob,
	handelCreateJobPost,
	handelUpdateJobPost,
	handelDeleteJobPost,
};
