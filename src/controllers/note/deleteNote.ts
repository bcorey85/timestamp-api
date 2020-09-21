import { Request, Response } from 'express';
import { Note } from '../../models/Note';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { noteMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';
import { Task } from '../../models/Task';
import { Project } from '../../models/Project';

const deleteNote = async (req: Request, res: Response) => {
	const { noteId } = req.params;

	const note = await Note.find({ note_id: noteId });

	if (!note) {
		throw new NotFoundError();
	}

	const task = await Task.find({ task_id: note.taskId });

	if (!task) {
		throw new NotFoundError();
	}

	await Task.update(note.taskId, {
		notes: task.notes - 1,
		hours: task.hours - note.hours,
		updated_at: new Date(Date.now())
	});

	const project = await Project.find({ project_id: note.projectId });

	if (!project) {
		throw new NotFoundError();
	}

	await Project.update(note.projectId, {
		notes: project.notes - 1,
		hours: project.hours - note.hours,
		updated_at: new Date(Date.now())
	});

	await Note.delete(noteId);

	const response = new SuccessResponse({
		message: noteMessage.success.deleteNote,
		data: {}
	});

	res.status(200).send(response.body);
};

export { deleteNote };
