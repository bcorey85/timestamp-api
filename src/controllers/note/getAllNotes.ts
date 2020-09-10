import { Request, Response } from 'express';
import { Note } from '../../models/Note';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { noteMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';

const getAllNotes = async (req: Request, res: Response) => {
	const { user_id } = req.user!;

	const notes = await Note.findAll(user_id);

	if (!notes) {
		throw new NotFoundError();
	}

	const response = new SuccessResponse({
		message: noteMessage.success.getNote,
		data: notes
	});

	res.status(200).send(response.body);
};

export { getAllNotes };
