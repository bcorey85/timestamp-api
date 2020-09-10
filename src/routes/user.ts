import express from 'express';
import {
	getUserById,
	updateUserById,
	deleteUserById
} from '../controllers/user';
import { validateRequest } from '../middleware/validateRequest';
import {
	userIdParamRequired,
	updateUserPassword,
	updateUserEmail
} from '../validators';
import { authUser } from '../middleware/authUser';

const router = express.Router();

router.get(
	'/:userId',
	[ userIdParamRequired ],
	validateRequest,
	authUser,
	getUserById
);

router.put(
	'/:userId',
	[ userIdParamRequired, updateUserPassword, updateUserEmail ],
	validateRequest,
	authUser,
	updateUserById
);

router.delete(
	'/:userId',
	[ userIdParamRequired ],
	validateRequest,
	authUser,
	deleteUserById
);

export { router as userRouter };
