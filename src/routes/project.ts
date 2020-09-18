import express from 'express';
import { validateRequest } from '../middleware/validateRequest';
import {
	createProject,
	getProjectById,
	getAllProjects,
	updateProject,
	deleteProject
} from '../controllers/project';
import {
	userIdParamRequired,
	titleRequired,
	projectIdParamRequired
} from '../validators';
import { authUser } from '../middleware/authUser';

const router = express.Router();

router.post(
	'/:userId',
	[ userIdParamRequired, titleRequired ],
	validateRequest,
	authUser,
	createProject
);

router.get(
	'/:userId',
	[ userIdParamRequired ],
	validateRequest,
	authUser,
	getAllProjects
);

router.get(
	'/:userId/:projectId',
	[ userIdParamRequired, projectIdParamRequired ],
	validateRequest,
	authUser,
	getProjectById
);

router.put(
	'/:userId/:projectId',
	[ userIdParamRequired, projectIdParamRequired, titleRequired ],
	validateRequest,
	authUser,
	updateProject
);

router.delete(
	'/:userId/:projectId',
	[ userIdParamRequired, projectIdParamRequired ],
	validateRequest,
	authUser,
	deleteProject
);

export { router as projectRouter };
