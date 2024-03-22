import mongoose from 'mongoose';
import user from './user';

const jobPostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		validate: (title) =>
			typeof title === 'string' && title.length > 0 && title.length < 500,
	},
	companyName: {
		type: String,
		required: false,
		validate: (companyName) =>
			typeof companyName === 'string' &&
			companyName.length > 0 &&
			companyName.length < 300,
	},
	jobPostOwner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	WorkplaceType: {
		type: String,
		required: true,
		default: 'remote',
		enum: ['onsite', 'hybrid', 'remote'],
	},
	JobType: {
		type: String,
		required: true,
		default: 'fulltime',
		enum: [
			'fulltime',
			'parttime',
			'contract',
			'volunteer',
			'temporary',
			'internship',
			'other',
		],
	},
	isHidden: {
		type: Boolean,
		default: false,
		required: false,
	},
	location: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
		validate: (description) =>
			typeof description === 'string' &&
			description.length > 0 &&
			description.length < 2000,
	},
	otherDescription: {
		type: String,
		required: false,
		validate: (otherDescription) =>
			typeof otherDescription === 'string' &&
			otherDescription.length > 0 &&
			otherDescription.length < 2000,
	},
	Benefits: {
		type: Array[String],
		required: false,
	},
	requirements: {
		type: [String],
		required: true,
	},
	responsibilities: {
		type: [String],
		required: true,
	},
	Qualifications: {
		type: String,
		required: false,
	},
	yearsOfWorkExperience: {
		type: Number,
		required: false,
	},
	salary: {
		type: Number | String,
		required: false,
	},
	postedAt: {
		type: Date,
		default: Date.now,
	},
	applicant: [user],
});

const JobPost = mongoose.model('JobPost', jobPostSchema);

module.exports = JobPost;
