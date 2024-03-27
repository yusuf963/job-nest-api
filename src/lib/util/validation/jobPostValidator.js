import { check } from 'express-validator';

import { validatorMiddleware } from '../../middleware/validator.js';
import JobPost from '../../../model/jobPost.js';

const checkValueExists = async (id, Model) => {
	const doc = await Model.findById(id);
	if (!doc) {
		throw new Error(
			`No ${Model === JobPost ? 'job' : 'user'} found with ID ${id}`,
		);
	}
	return doc;
};

const actionPermission = async (jobId, { req }) => {
	const course = await checkValueExists(jobId, JobPost);
	if (
		!req.currentUser.isAdmin &&
		course.creator.toString() !== req.currentUser.id
	) {
		throw new Error('You can not perform this action');
	}
	return true;
};

const getSingleJobValidator = [
	check('id')
		.isMongoId()
		.withMessage('Invalid job ID format')
		.custom(async (jobId) => await checkValueExists(jobId, JobPost)),
	validatorMiddleware,
];

const createJobPostValidator = [
	check('title')
		.notEmpty()
		.withMessage('Title field is required')
		.isString()
		.withMessage('Title field required string')
		.isLength({ min: 1, max: 500 })
		.withMessage('Title must be between 1 and 500 characters long'),

	check('companyName')
		.notEmpty()
		.withMessage('Company name field is required')
		.isString()
		.withMessage('Company name required string')
		.isLength({ min: 1, max: 300 })
		.withMessage('Company name must be between 1 and 300 characters long'),

	check('jobPostOwner')
		.notEmpty()
		.withMessage('Job owner ID required')
		.isMongoId()
		.withMessage('Invalid Job owner ID format')
		.custom(async (JobOwnerId) => await checkValueExists(JobOwnerId, User)),

	check('workplaceType')
		.notEmpty()
		.withMessage('Work place type field is required')
		.isString()
		.withMessage('Work place type field required string')
		.custom((value) => {
			const workTypes = ['onsite', 'hybrid', 'remote'];
			if (!workTypes.includes(value)) {
				throw new Error(
					'Work place type must be one of onsite, hybrid, remote',
				);
			}
			return true;
		}),

	check('jobType')
		.notEmpty()
		.withMessage('Job type field is required')
		.isString()
		.withMessage('Job type field required string')
		.custom((value) => {
			const jobTypes = [
				'fulltime',
				'parttime',
				'contract',
				'volunteer',
				'temporary',
				'internship',
				'other',
			];
			if (!jobTypes.includes(value)) {
				throw new Error(
					'Job type must be one of fulltime, parttime, contract, volunteer, temporary, internship, other',
				);
			}
			return true;
		}),

	check('isHidden')
		.notEmpty()
		.withMessage('isHidden field is required')
		.isBoolean()
		.withMessage('isHidden field required true or false'),

	check('location')
		.notEmpty()
		.withMessage('Location field is required')
		.isString()
		.withMessage('Location field required string'),

	check('description')
		.notEmpty()
		.withMessage('Description field is required')
		.isString()
		.withMessage('Description field required string')
		.isLength({ min: 1, max: 2000 })
		.withMessage('Title must be between 1 and 500 characters long'),

	check('otherDescription')
		.optional()
		.isString()
		.withMessage('Other description field required string')
		.isLength({ min: 1, max: 2000 })
		.withMessage('Title must be between 1 and 500 characters long'),

	check('Benefits')
		.optional()
		.isArray()
		.withMessage('Benefits are required in array'),

	check('requirements')
		.notEmpty()
		.withMessage('Requirements field required ')
		.isArray()
		.withMessage('Requirements are required in array'),

	check('responsibilities')
		.notEmpty()
		.withMessage('Responsibilities field required ')
		.isArray()
		.withMessage('Responsibilities are required in array'),

	check('Qualifications')
		.optional()
		.isString()
		.withMessage('Qualifications field required string'),

	check('yearsOfWorkExperience')
		.optional()
		.isNumeric()
		.withMessage('Years Of Work Experience field required number'),

	check('salary').optional(),

	check('postedAt')
		.optional()
		.isDate()
		.withMessage('postedAt field required date'),

	check('applicant')
		.optional()
		.isArray()
		.withMessage('applicant are required in array'),
	validatorMiddleware,
];

const updateJobPostValidator = [
	check('id')
		.isMongoId()
		.withMessage('Invalid course id format')
		.custom(actionPermission),

	check('title')
		.optional()
		.isString()
		.withMessage('Title field required string')
		.isLength({ min: 1, max: 500 })
		.withMessage('Title must be between 1 and 500 characters long'),

	check('companyName')
		.optional()
		.isString()
		.withMessage('Company name required string')
		.isLength({ min: 1, max: 300 })
		.withMessage('Company name must be between 1 and 300 characters long'),

	check('jobPostOwner')
		.optional()
		.isMongoId()
		.withMessage('Invalid Job owner ID format')
		.custom(async (JobOwnerId) => await checkValueExists(JobOwnerId, User)),

	check('workplaceType')
		.optional()
		.isString()
		.withMessage('Work place type field required string')
		.custom((value) => {
			const workTypes = ['onsite', 'hybrid', 'remote'];
			if (!workTypes.includes(value)) {
				throw new Error(
					'Work place type must be one of onsite, hybrid, remote',
				);
			}
			return true;
		}),

	check('jobType')
		.optional()
		.isString()
		.withMessage('Job type field required string')
		.custom((value) => {
			const jobTypes = [
				'fulltime',
				'parttime',
				'contract',
				'volunteer',
				'temporary',
				'internship',
				'other',
			];
			if (!jobTypes.includes(value)) {
				throw new Error(
					'Job type must be one of fulltime, parttime, contract, volunteer, temporary, internship, other',
				);
			}
			return true;
		}),

	check('isHidden')
		.optional()
		.isBoolean()
		.withMessage('isHidden field required true or false'),

	check('location')
		.optional()
		.isString()
		.withMessage('Location field required string'),

	check('description')
		.optional()
		.isString()
		.withMessage('Description field required string')
		.isLength({ min: 1, max: 2000 })
		.withMessage('Title must be between 1 and 500 characters long'),

	check('otherDescription')
		.optional()
		.isString()
		.withMessage('Other description field required string')
		.isLength({ min: 1, max: 2000 })
		.withMessage('Title must be between 1 and 500 characters long'),

	check('Benefits')
		.optional()
		.isArray()
		.withMessage('Benefits are required in array'),

	check('requirements')
		.optional()
		.isArray()
		.withMessage('Requirements are required in array'),

	check('responsibilities')
		.optional()
		.isArray()
		.withMessage('Responsibilities are required in array'),

	check('Qualifications')
		.optional()
		.isString()
		.withMessage('Qualifications field required string'),

	check('yearsOfWorkExperience')
		.optional()
		.isNumeric()
		.withMessage('Years Of Work Experience field required number'),

	check('salary').optional(),

	check('postedAt')
		.optional()
		.isDate()
		.withMessage('postedAt field required date'),

	check('applicant')
		.optional()
		.isArray()
		.withMessage('applicant are required in array'),
	validatorMiddleware,
];

const deleteJobPostValidator = [
	check('id')
		.isMongoId()
		.withMessage('Invalid job ID format')
		.custom(actionPermission),
	validatorMiddleware,
];

export {
	getSingleJobValidator,
	createJobPostValidator,
	updateJobPostValidator,
	deleteJobPostValidator,
};
