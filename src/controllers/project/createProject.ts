import { Request, Response } from 'express';

import { SuccessResponse } from '../../responses/SuccessResponse';
import { createMessage } from '../../responses/responseStrings';
import { User } from '../../models/User';
import { Project } from '../../models/Project';
import { NotFoundError } from '../../responses/errors/NotFoundError';

const createProject = async (req: Request, res: Response) => {
	const { userId } = req.params;
	const { title, description, pinned } = req.body;

	const user = await User.find({ user_id: userId });

	if (!user) {
		throw new NotFoundError();
	}

	await Project.create({
		title,
		description,
		pinned,
		userId: userId
	});

	const response = new SuccessResponse({
		message: createMessage.success.project,
		data: {}
	});

	res.status(201).send(response.body);
};

export { createProject };
