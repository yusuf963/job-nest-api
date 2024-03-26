import { check } from 'express-validator';
import { validatorMiddleware } from '../../middleware/validator.js';

import User from '../../../model/user.js';
import Course from '../../../model/course.js';

const checkValueExists = async (id, Model) => {
	const doc = await Model.findById(id);
	if (!doc) {
		throw new Error(
			`No ${Model === Course ? 'course' : 'user'} found with ID ${id}`,
		);
	}
	return doc;
};

const actionPermission = async (courseId, { req }) => {
	const course = await checkValueExists(courseId, Course);
	if (
		!req.currentUser.isAdmin &&
		course.creator.toString() !== req.currentUser.id
	) {
		throw new Error('You can not perform this action');
	}
	return true;
};

const getSingleCourseValidator = [
	check('id')
		.isMongoId()
		.withMessage('Invalid course id format')
		.custom(async (courseId) => await checkValueExists(courseId, Course)),
	validatorMiddleware,
];

const createCourseValidator = [
	check('title')
		.notEmpty()
		.withMessage('Title field is required')
		.isString()
		.withMessage('Title field required string')
		.isLength({ min: 1, max: 500 })
		.withMessage('Title must be between 1 and 500 characters long')
		.custom(async (coursetTitle) => {
			const course = await Course.findOne({ title: coursetTitle });
			if (course) {
				throw new Error('This course already exists');
			}
			return true;
		}),

	check('description')
		.notEmpty()
		.withMessage('Description field is required')
		.isString()
		.withMessage('Description field required string')
		.isLength({ min: 1, max: 2000 })
		.withMessage('Title must be between 1 and 500 characters long'),

	check('instructor')
		.notEmpty()
		.withMessage('Instructor field is required')
		.isString()
		.withMessage('Instructor field required string'),

	check('duration')
		.notEmpty()
		.withMessage('Duration field required string')
		.isNumeric()
		.withMessage('Duration field required number'),

	check('level')
		.notEmpty()
		.withMessage('Level field is required')
		.isString()
		.withMessage('Level field required string')
		.custom((levelValue) => {
			const levels = ['Beginner', 'Intermediate', 'Advance'];
			if (!levels.includes(levelValue)) {
				throw new Error('Level must be one of Beginner, Intermediate, Advance');
			}
			return true;
		}),

	check('prerequisites')
		.optional()
		.isArray()
		.withMessage('Prerequisites are required in array'),

	check('skillsCovered')
		.optional()
		.isArray()
		.withMessage('SkillsCovered are required in array'),

	check('courseLink')
		.notEmpty()
		.withMessage('Course link field is required')
		.isString()
		.withMessage('Course link field required string'),

	check('creator')
		.notEmpty()
		.withMessage('Creator ID required')
		.isMongoId()
		.withMessage('Invalid creator ID')
		.custom(async (creatorId) => await checkValueExists(creatorId, User)),

	validatorMiddleware,
];

const updateCourseValidator = [
	check('id')
		.isMongoId()
		.withMessage('Invalid course id format')
		.custom(actionPermission),

	check('title')
		.optional()
		.isString()
		.withMessage('Title field required string')
		.isLength({ min: 1, max: 500 })
		.withMessage('Title must be between 1 and 500 characters long')
		.custom(async (coursetTitle) => {
			const course = await Course.findOne({ title: coursetTitle });
			if (course) {
				throw new Error('This course already exists');
			}
			return true;
		}),

	check('description')
		.optional()
		.isString()
		.withMessage('Description field required string')
		.isLength({ min: 1, max: 2000 })
		.withMessage('Title must be between 1 and 500 characters long'),

	check('instructor')
		.optional()
		.isString()
		.withMessage('Instructor field required string'),

	check('duration')
		.optional()
		.isNumeric()
		.withMessage('Duration field required number'),

	check('level')
		.optional()
		.isString()
		.withMessage('Level field required string')
		.custom((levelValue) => {
			const levels = ['Beginner', 'Intermediate', 'Advance'];
			if (!levels.includes(levelValue)) {
				throw new Error('Level must be one of Beginner, Intermediate, Advance');
			}
			return true;
		}),

	check('prerequisites')
		.optional()
		.isArray()
		.withMessage('Prerequisites are required in array'),

	check('skillsCovered')
		.optional()
		.isArray()
		.withMessage('SkillsCovered are required in array'),

	check('courseLink')
		.optional()
		.isString()
		.withMessage('Course link field required string'),

	check('creator')
		.optional()
		.isMongoId()
		.withMessage('Invalid creator ID')
		.custom(async (creatorId) => await checkValueExists(creatorId, User)),
	validatorMiddleware,
];

const deleteCourseValidator = [
	check('id')
		.isMongoId()
		.withMessage('Invalid course id format')
		.custom(actionPermission),
	validatorMiddleware,
];

export {
	getSingleCourseValidator,
	createCourseValidator,
	updateCourseValidator,
	deleteCourseValidator,
};
