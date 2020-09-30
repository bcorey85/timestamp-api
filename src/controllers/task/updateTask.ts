import { Request, Response } from 'express';
import { Task, TaskModel } from '../../models/Task';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { taskMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';
import { ItemService } from '../../util/ItemService';

const handleTaskMoveCheck = (task: TaskModel, projectId: string) => {
	const moveToNewProject = projectId !== task.projectId.toString();

	if (moveToNewProject) {
		ItemService.moveTaskToNewProject(task, projectId);
	}
};

const updateTask = async (req: Request, res: Response) => {
	const { taskId } = req.params;
	const { title, description, tags, pinned, projectId } = req.body;

	const task = await Task.find({ task_id: taskId });
	if (!task) {
		throw new NotFoundError();
	}

	const tagString = ItemService.mergeTags(tags);

	handleTaskMoveCheck(task, projectId);

	await Task.update(taskId, {
		title,
		description,
		tags: tagString,
		pinned,
		updated_at: new Date(Date.now())
	});

	const response = new SuccessResponse({
		message: taskMessage.success.updateTask,
		data: {}
	});

	res.status(200).send(response.body);
};

export { updateTask };
