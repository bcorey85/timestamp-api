import express from 'express';
import { validateRequest } from '../middleware/validateRequest';
import {
	createNote,
	getNoteById,
	getAllNotes,
	updateNote,
	deleteNote
} from '../controllers/note';
import {
	userIdParamRequired,
	titleRequired,
	descriptionRequired,
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
		descriptionRequired,
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
	[ userIdParamRequired, noteIdParamRequired ],
	validateRequest,
	authUser,
	updateNote
);

router.delete(
	'/:userId/:noteId',
	[ userIdParamRequired, noteIdParamRequired ],
	validateRequest,
	authUser,
	deleteNote
);

export { router as noteRouter };
