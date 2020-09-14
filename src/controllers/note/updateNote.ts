import { Request, Response } from 'express';
import { Note } from '../../models/Note';
import { Task } from '../../models/Task';
import { Project } from '../../models/Project';
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

	const task = await Task.find({ task_id: note.task_id });

	if (!task) {
		throw new NotFoundError();
	}

	await Task.update(note.task_id, {
		hours: task.hours - note.hours + hours,
		updated_at: new Date(Date.now())
	});

	const project = await Project.find({ project_id: note.project_id });

	if (!project) {
		throw new NotFoundError();
	}

	await Project.update(note.project_id, {
		hours: project.hours - note.hours + hours,
		updated_at: new Date(Date.now())
	});

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
		pinned,
		updated_at: new Date(Date.now())
	});

	const response = new SuccessResponse({
		message: noteMessage.success.updateNote,
		data: {}
	});

	res.status(200).send(response.body);
};

export { updateNote };
