import express from 'express';
import { validateRequest } from '../middleware/validateRequest';
import {
	createNote,
	getNoteById,
	getAllNotes,
	updateNote,
	deleteNote,
	noteActions
} from '../controllers/note';
import {
	userIdParamRequired,
	titleRequired,
	startTimeRequired,
	endTimeRequired,
	projectRequired,
	taskRequired,
	noteIdParamRequired
} from '../validators';
import { authUser } from '../middleware/authUser';

const router = express.Router();

router.post(
	'/:userId',
	[
		userIdParamRequired,
		titleRequired,
		startTimeRequired,
		endTimeRequired,
		projectRequired,
		taskRequired
	],
	validateRequest,
	authUser,
	createNote
);

router.get(
	'/:userId/:noteId',
	[ userIdParamRequired, noteIdParamRequired ],
	validateRequest,
	authUser,
	getNoteById
);

router.get(
	'/:userId',
	[ userIdParamRequired ],
	validateRequest,
	authUser,
	getAllNotes
);

router.put(
	'/:userId/:noteId',
	[
		userIdParamRequired,
		noteIdParamRequired,
		taskRequired,
		projectRequired,
		titleRequired,
		startTimeRequired,
		endTimeRequired,
		projectRequired,
		taskRequired
	],
	validateRequest,
	authUser,
	updateNote
);

router.put(
	'/:userId/:noteId/actions',
	[],
	validateRequest,
	authUser,
	noteActions
);

router.delete(
	'/:userId/:noteId',
	[ userIdParamRequired, noteIdParamRequired ],
	validateRequest,
	authUser,
	deleteNote
);

export { router as noteRouter };
