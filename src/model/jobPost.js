import mongoose from 'mongoose';
import { CategoryEnum } from '../lib/util/constants.js';

const jobPostSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		validate: (title) =>
			typeof title === 'string' && title.length > 1 && title.length < 500,
	},
	companyName: {
		type: String,
		required: false,
		validate: (companyName) =>
			typeof companyName === 'string' &&
			companyName.length > 1 &&
			companyName.length < 300,
	},
	jobPostOwner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	workplaceType: {
		type: String,
		required: true,
		default: 'remote',
		enum: ['onsite', 'hybrid', 'remote'],
	},
	jobType: {
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
			description.length > 1 &&
			description.length < 2000,
	},
	otherDescription: {
		type: String,
		required: false,
		validate: (otherDescription) =>
			typeof otherDescription === 'string' &&
			otherDescription.length > 1 &&
			otherDescription.length < 2000,
	},
	Benefits: {
		type: [String],
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
		type: mongoose.Schema.Types.Mixed,
		required: false,
	},
	postedAt: {
		type: Date,
		default: Date.now,
	},
	applicant: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	],
	category: {
		type: String,
		enum: CategoryEnum,
		required: true,
	},
});

export default mongoose.model('JobPost', jobPostSchema);
