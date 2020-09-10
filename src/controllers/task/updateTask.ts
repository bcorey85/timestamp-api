import { Request, Response } from 'express';
import { Task } from '../../models/Task';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { taskMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';

const updateTask = async (req: Request, res: Response) => {
	const { taskId } = req.params;
	const { title, description, tags, pinned } = req.body;

	const task = await Task.find({ task_id: taskId });

	if (!task) {
		throw new NotFoundError();
	}

	let tagString;
	if (tags) {
		tagString = tags.join(',');
	}

	await Task.update(taskId, {
		title,
		description,
		tags: tagString || null,
		pinned
	});

	const response = new SuccessResponse({
		message: taskMessage.success.updateTask,
		data: {}
	});

	res.status(200).send(response.body);
};

export { updateTask };
