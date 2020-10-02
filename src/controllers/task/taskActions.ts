import { Request, Response } from 'express';
import { Note } from '../../models/Note';
import { Project, ProjectModel } from '../../models/Project';
import { Task, TaskModel } from '../../models/Task';
import { BadRequestError } from '../../responses/errors/BadRequestError';
import { NotFoundError } from '../../responses/errors/NotFoundError';
import { genericMessage, taskMessage } from '../../responses/responseStrings';
import { SuccessResponse } from '../../responses/SuccessResponse';

const handleCompleteTask = async (task: TaskModel, completedBy: string) => {
	const childNotes = await Note.findAll({ task_id: task.taskId });
	if (task.completedOn === null) {
		await Task.update(task.taskId, {
			completed_on: new Date().toISOString(),
			completed_by: completedBy
		});
		// Flag child items as complete, but differentiate from user completion
		childNotes.map(async note => {
			if (note.completedOn === null) {
				await Note.update(note.noteId, {
					completed_on: new Date().toISOString(),
					completed_by: 'task'
				});
			}
		});
	} else {
		await Task.update(task.taskId, {
			completed_on: null,
			completed_by: null
		});
		// Remove completion status from task complete request
		childNotes.map(async note => {
			if (note.completedBy === 'task') {
				await Note.update(note.noteId, {
					completed_on: null,
					completed_by: null
				});
			}
		});
	}
};

const taskActions = async (req: Request, res: Response) => {
	const query = req.query;
	const { taskId } = req.params;

	if (!query) {
		return new BadRequestError(genericMessage.error.noActionQuery);
	}

	const task = await Task.find({ task_id: taskId });

	if (!task) {
		return new NotFoundError();
	}

	// Toggle completed status
	if (query.completed) {
		await handleCompleteTask(task, 'user');
		const response = new SuccessResponse({
			message: taskMessage.success.completeTask,
			data: {}
		});

		return res.status(200).send(response.body);
	}
};

export { taskActions };
