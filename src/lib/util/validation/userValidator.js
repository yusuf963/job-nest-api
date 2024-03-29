import { check } from 'express-validator';
import { validatorMiddleware } from '../../middleware/validator.js';

import User from '../../../model/user.js';

const checkValueExists = async (id, Model) => {
	const doc = await Model.findById(id);
	if (!doc) {
		throw new Error(`No user found with ID ${id}`);
	}
	return doc;
};

const getUserValidator = [
	check('id')
		.isMongoId()
		.withMessage('Invalid user ID format')
		.custom(async (userId) => await checkValueExists(userId, User)),
	validatorMiddleware,
];

const createUserValidator = [
	check('firstName')
		.optional()
		.isString()
		.withMessage('First name  required string')
		.isLength({ min: 2, max: 30 })
		.withMessage('First name field must be between 2 and 30 characters long'),

	check('lastName')
		.optional()
		.isString()
		.withMessage('Last name required string')
		.isLength({ min: 2, max: 30 })
		.withMessage('Last name field must be between 2 and 30 characters long'),

	check('username')
		.notEmpty()
		.withMessage('User name field required')
		.isLength({ min: 2, max: 30 })
		.withMessage('User name field must be between 2 and 30 characters long')
		.custom(async (val) => {
			const user = await User.findOne({ username: val });
			if (user) {
				throw new Error('User name must be unique');
			}
			return true;
		}),

	check('email')
		.notEmpty()
		.withMessage('Email field is required')
		.isEmail()
		.withMessage('Invalid email address')
		.custom(async (val) => {
			const user = await User.findOne({ email: val });
			if (user) {
				throw new Error('Email already in use, please try another email');
			}
			return true;
		}),

	check('isTermsAgreed')
		.notEmpty()
		.withMessage('terms agreed field is required')
		.isBoolean()
		.withMessage('terms agreed required true or false'),

	check('confirmPassword')
		.notEmpty()
		.withMessage('Password confirm is required'),

	check('password')
		.notEmpty()
		.withMessage('Password field is required')
		.isLength({ min: 8, max: 100 })
		.withMessage('Password field must be at between 8 and 100 characters long')
		.custom((val, { req }) => {
			if (val !== req.body.confirmPassword) {
				throw new Error('Incorrect password confirm');
			}
			return true;
		}),
	validatorMiddleware,
];

const updateUserValidator = [
	check('id').isMongoId().withMessage('Invalid user ID format'),

	check('firstName')
		.optional()
		.isString()
		.withMessage('First name  required string')
		.isLength({ min: 2, max: 30 })
		.withMessage('First name field must be between 2 and 30 characters long'),

	check('lastName')
		.optional()
		.isString()
		.withMessage('Last name required string')
		.isLength({ min: 2, max: 30 })
		.withMessage('Last name field must be between 2 and 30 characters long'),

	check('username')
		.optional()
		.isLength({ min: 2, max: 30 })
		.withMessage('User name field must be between 2 and 30 characters long')
		.custom(async (val) => {
			const user = await User.findOne({ username: val });
			if (user) {
				throw new Error('User name must be unique');
			}
			return true;
		}),

	check('email')
		.optional()
		.isEmail()
		.withMessage('Invalid email address')
		.custom(async (val) => {
			const user = await User.findOne({ email: val });
			if (user) {
				throw new Error('Email already in use, please try another email');
			}
			return true;
		}),

	check('phone').optional(),

	check('address.street')
		.optional()
		.isString()
		.withMessage('Street required string')
		.isLength({ min: 3, max: 100 })
		.withMessage('Street must be between 3 and 100'),

	check('address.city')
		.optional()
		.isString()
		.withMessage('City required string')
		.isLength({ min: 3, max: 50 })
		.withMessage('Street must be between 3 and 50'),

	check('address.area')
		.optional()
		.isString()
		.withMessage('Area required string')
		.isLength({ min: 3, max: 50 })
		.withMessage('Street must be between 3 and 50'),

	check('address.postCode')
		.optional()
		.isString()
		.withMessage('PostCode required string')
		.isLength({ min: 3, max: 50 })
		.withMessage('PostCode must be between 3 and 50'),

	check('address.country')
		.optional()
		.isString()
		.withMessage('Country required string')
		.isLength({ min: 2, max: 50 })
		.withMessage('Country must be between 2 and 50'),
	validatorMiddleware,
];

const deletUserValidator = [
	check('id')
		.isMongoId()
		.withMessage('Invalid user ID format')
		.custom(async (userId) => await checkValueExists(userId, User)),
	validatorMiddleware,
];

export {
	getUserValidator,
	createUserValidator,
	updateUserValidator,
	deletUserValidator,
};
