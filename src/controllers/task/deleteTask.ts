import { Request, Response } from 'express';
import { Note } from '../../models/Note';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { taskMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';
import { Task } from '../../models/Task';
import { Project } from '../../models/Project';

const deleteTask = async (req: Request, res: Response) => {
	const { taskId } = req.params;

	const task = await Task.find({ task_id: taskId });

	if (!task) {
		throw new NotFoundError();
	}

	const project = await Project.find({ project_id: task.project_id });

	if (!project) {
		throw new NotFoundError();
	}

	await Project.update(task.project_id, {
		tasks: project.tasks - 1,
		hours: project.hours - task.hours,
		notes: project.notes - task.notes,
		updated_at: new Date(Date.now())
	});

	await Task.delete(taskId);

	const response = new SuccessResponse({
		message: taskMessage.success.deleteTask,
		data: {}
	});

	res.status(200).send(response.body);
};

export { deleteTask };
