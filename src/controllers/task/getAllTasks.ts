import { Request, Response } from 'express';
import { Task } from '../../models/Task';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { taskMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';

const getAllTasks = async (req: Request, res: Response) => {
	const { user_id } = req.user!;

	const tasks = await Task.findAll(user_id);

	if (!tasks) {
		throw new NotFoundError();
	}

	const response = new SuccessResponse({
		message: taskMessage.success.getTask,
		data: tasks
	});

	res.status(200).send(response.body);
};

export { getAllTasks };
