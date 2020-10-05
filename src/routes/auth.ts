import express from 'express';
import { validateRequest } from '../middleware/validateRequest';
import {
	signup,
	login,
	forgotPassword,
	resetPassword
} from '../controllers/auth';
import {
	emailRequired,
	passwordConfirm,
	passwordRequired
} from '../validators';
import { updateUserPassword } from '../validators';

const router = express.Router();

router.post(
	'/signup',
	[ emailRequired, passwordRequired, passwordConfirm ],
	validateRequest,
	signup
);

router.post(
	'/login',
	[ emailRequired, passwordRequired ],
	validateRequest,
	login
);

router.post(
	'/forgot-password',
	[ emailRequired ],
	validateRequest,
	forgotPassword
);

router.put(
	'/reset-password/:resetToken',
	[ updateUserPassword ],
	validateRequest,
	resetPassword
);

export { router as authRouter };
