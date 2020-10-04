import { Request, Response } from 'express';
import { Note } from '../../models/Note';
import { Task } from '../../models/Task';
import { BadRequestError } from '../../responses/errors/BadRequestError';
import { NotFoundError } from '../../responses/errors/NotFoundError';
import { genericMessage, taskMessage } from '../../responses/responseStrings';
import { SuccessResponse } from '../../responses/SuccessResponse';

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

	if (query.completed) {
		await Task.complete(task, 'user');
		const childNotes = await Note.findAll({ task_id: task.taskId });
		await Task.completeChildNotes(task, childNotes);
		const response = new SuccessResponse({
			message: taskMessage.success.completeTask,
			data: {}
		});

		return res.status(200).send(response.body);
	}
};

export { taskActions };
