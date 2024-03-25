import asyncHandler from 'express-async-handler';

import { APIError, HttpStatusCode } from '../lib/util/errorHandler.js';
import Course from '../model/course.js';

const retriveCourseFromDB = asyncHandler(async () => await Course.find({}));

const handelGetAllCourses = asyncHandler(async (_req, res) => {
	const allCourses = await retriveCourseFromDB();
	if (allCourses)
		res
			.status(200)
			.json({ results: allCourses.length, allCourses, status: 'succeed' });
});

const createCourse = asyncHandler(async (req) => await Course.create(req.body));

const handelCreateCourse = asyncHandler(async (req, res) => {
	const createdCourse = await createCourse(req);
	if (createdCourse) {
		res.status(201).json({ createdCourse, status: 'succeed' });
	}
});

const retriveSignleCourseResourceFromDB = asyncHandler(
	async (courseId) => await Course.findById(courseId).exec(),
);

const handelGetSingleCourse = asyncHandler(async (req, res, next) => {
	const singleCourse = await retriveSignleCourseResourceFromDB(req.params.id);
	if (!singleCourse) {
		return next(
			new APIError(
				'NOT FOUND',
				HttpStatusCode.NOT_FOUND,
				true,
				`No course found with that ID`,
			),
		);
	}
	res.status(200).json({ singleCourse, status: 'succeed' });
});

const updateCourseResourceFromDB = asyncHandler(
	async (courseId) => await Course.findById(courseId),
);

const handelUpdateCourse = asyncHandler(async (req, res, next) => {
	const currentUser = req.currentUser;

	const courseToUpdate = await updateCourseResourceFromDB(req.params.id);
	if (!courseToUpdate) {
		return next(
			new APIError(
				'NOT FOUND',
				HttpStatusCode.NOT_FOUND,
				true,
				`No course found with that ID`,
			),
		);
	}
	if (!currentUser?.isAdmin) {
		return res
			.status(401)
			.send({ message: 'Unauthorized you can not modify this course' });
	}
	courseToUpdate.set(req.body);
	courseToUpdate.save();
	res.send(courseToUpdate);
});

const deleteCourseResourceFromDB = asyncHandler(
	async (courseId) => await Course.findById(courseId),
);

const handelDeleteCourse = asyncHandler(async (req, res, next) => {
	const currentUser = req.currentUser;

	const courseToDelete = await deleteCourseResourceFromDB(req.params.id);
	if (!courseToDelete) {
		return next(
			new APIError(
				'NOT FOUND',
				HttpStatusCode.NOT_FOUND,
				true,
				`No course found with that ID`,
			),
		);
	}
	if (!currentUser?.isAdmin) {
		return res.status(401).send({ message: 'Unauthorized' });
	}
	await courseToDelete.deleteOne();
	return res.send(courseToDelete);
});

export {
	handelGetAllCourses,
	handelCreateCourse,
	handelGetSingleCourse,
	handelUpdateCourse,
	handelDeleteCourse,
};
