import express from 'express';
import { validateRequest } from '../middleware/validateRequest';
import {
	createTask,
	getTaskById,
	getAllTasks,
	updateTask,
	deleteTask
} from '../controllers/task';
import {
	userIdParamRequired,
	titleRequired,
	projectRequired,
	taskIdParamRequired
} from '../validators';
import { authUser } from '../middleware/authUser';

const router = express.Router();

router.post(
	'/:userId',
	[ userIdParamRequired, titleRequired, projectRequired ],
	validateRequest,
	authUser,
	createTask
);

router.get(
	'/:userId/:taskId',
	[ userIdParamRequired, taskIdParamRequired ],
	validateRequest,
	authUser,
	getTaskById
);

router.get(
	'/:userId',
	[ userIdParamRequired ],
	validateRequest,
	authUser,
	getAllTasks
);

router.put(
	'/:userId/:taskId',
	[
		userIdParamRequired,
		taskIdParamRequired,
		titleRequired,
		projectRequired
	],
	validateRequest,
	authUser,
	updateTask
);

router.delete(
	'/:userId/:taskId',
	[ userIdParamRequired, taskIdParamRequired ],
	validateRequest,
	authUser,
	deleteTask
);

export { router as taskRouter };
