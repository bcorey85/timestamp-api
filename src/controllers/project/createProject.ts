import { Request, Response } from 'express';

import { SuccessResponse } from '../../responses/SuccessResponse';
import { createMessage } from '../../responses/responseStrings';
import { User } from '../../models/User';
import { Project } from '../../models/Project';

const createProject = async (req: Request, res: Response) => {
	const { userId } = req.params;
	const { title, description, pinned } = req.body;

	const { user_id } = await User.find({ user_id: userId });

	await Project.create({
		title,
		description,
		pinned,
		userId: user_id
	});

	const response = new SuccessResponse({
		message: createMessage.success.project,
		data: {}
	});

	res.status(201).send(response.body);
};

export { createProject };
