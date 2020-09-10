import { Request, Response } from 'express';
import { Note } from '../../models/Note';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { noteMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';

const getNoteById = async (req: Request, res: Response) => {
	const note = await Note.find({ note_id: req.params.noteId });

	if (!note) {
		throw new NotFoundError();
	}

	const response = new SuccessResponse({
		message: noteMessage.success.getNote,
		data: note
	});

	res.status(200).send(response.body);
};

export { getNoteById };
