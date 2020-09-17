import { body, param, Meta } from 'express-validator';
import {
	requestValidationMessage,
	createMessage
} from '../responses/responseStrings';
import { User } from '../models/User';

export const emailRequired = body('email')
	.isEmail()
	.withMessage(requestValidationMessage.error.email);

export const passwordRequired = body('password')
	.trim()
	.isLength({ min: 6 })
	.withMessage(requestValidationMessage.error.password);

export const userIdParamRequired = param('userId')
	.notEmpty()
	.isNumeric()
	.withMessage(requestValidationMessage.error.userId);

export const projectIdParamRequired = param('projectId')
	.notEmpty()
	.withMessage(requestValidationMessage.error.projectId);

export const taskIdParamRequired = param('taskId')
	.notEmpty()
	.withMessage(requestValidationMessage.error.taskId);

export const noteIdParamRequired = param('noteId')
	.notEmpty()
	.withMessage(requestValidationMessage.error.noteId);

export const updateUserPassword = body(
	'password'
).custom((password, meta: Meta) => {
	if (password || password === '') {
		if (password !== meta.req.body.passwordConfirm) {
			throw new Error(requestValidationMessage.error.passwordNotMatch);
		}

		if (password.length < 6) {
			throw new Error(requestValidationMessage.error.password);
		}
	}

	return true;
});

export const updateUserEmail = body('email').custom(async email => {
	if (email || email === '') {
		const isEmail = (string: string) => {
			const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return string.match(emailRegex);
		};

		if (!isEmail(email)) {
			throw new Error(requestValidationMessage.error.email);
		}

		const existingEmail = await User.find({ email });

		if (existingEmail) {
			throw new Error(requestValidationMessage.error.emailInUse);
		}
	}

	return true;
});

export const titleRequired = body('title')
	.trim()
	.notEmpty()
	.withMessage(createMessage.error.title);

export const descriptionRequired = body('description')
	.trim()
	.notEmpty()
	.withMessage(createMessage.error.description);

export const projectRequired = body('projectId')
	.trim()
	.notEmpty()
	.withMessage(createMessage.error.project);

export const taskRequired = body('taskId')
	.trim()
	.notEmpty()
	.withMessage(createMessage.error.task);

export const startTimeRequired = body('startTime')
	.trim()
	.notEmpty()
	.withMessage(createMessage.error.start);

export const endTimeRequired = body('endTime')
	.trim()
	.notEmpty()
	.withMessage(createMessage.error.end);
