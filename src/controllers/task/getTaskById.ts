import { Request, Response } from 'express';
import { Task } from '../../models/Task';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { taskMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';

const getTaskById = async (req: Request, res: Response) => {
	const task = await Task.find({ task_id: req.params.taskId });

	if (!task) {
		throw new NotFoundError();
	}

	const response = new SuccessResponse({
		message: taskMessage.success.getTask,
		data: task
	});

	res.status(200).send(response.body);
};

export { getTaskById };
