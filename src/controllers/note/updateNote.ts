import { Request, Response } from 'express';
import { Note } from '../../models/Note';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { noteMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';
import { DateTimeService } from '../../util/DateTimeService';

const updateNote = async (req: Request, res: Response) => {
	const { noteId } = req.params;
	const { title, startTime, endTime, description, tags, pinned } = req.body;

	const note = await Note.find({ note_id: noteId });

	if (!note) {
		throw new NotFoundError();
	}

	const startDate = DateTimeService.parse(startTime);
	const endDate = DateTimeService.parse(endTime);

	const hours = DateTimeService.getHours(startDate, endDate);

	let tagString;
	if (tags) {
		tagString = tags.join(',');
	}

	await Note.update(noteId, {
		title,
		description,
		tags: tagString || null,
		start_time: startDate.toISOString(),
		end_time: endDate.toISOString(),
		hours,
		pinned
	});

	const response = new SuccessResponse({
		message: noteMessage.success.updateNote,
		data: {}
	});

	res.status(200).send(response.body);
};

export { updateNote };
