import { Request, Response } from 'express';

import { SuccessResponse } from '../../responses/SuccessResponse';
import { createMessage } from '../../responses/responseStrings';
import { User } from '../../models/User';
import { Task } from '../../models/Task';
import { Project } from '../../models/Project';
import { NotFoundError } from '../../responses/errors/NotFoundError';

const createTask = async (req: Request, res: Response) => {
	const { userId } = req.params;
	const { title, description, projectId, tags, pinned } = req.body;

	const user = await User.find({ user_id: userId });

	if (!user) {
		throw new NotFoundError();
	}

	await Task.create({
		title,
		description,
		projectId,
		tags,
		pinned,
		userId: userId
	});

	const project = await Project.find({ project_id: projectId });

	await Project.update(projectId, {
		tasks: project.tasks + 1
	});

	const response = new SuccessResponse({
		message: createMessage.success.task,
		data: {}
	});

	res.status(201).send(response.body);
};

export { createTask };
