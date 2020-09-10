import { Request, Response } from 'express';
import { Project } from '../../models/Project';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { projectMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';

const getAllProjects = async (req: Request, res: Response) => {
	const { user_id } = req.user!;

	const projects = await Project.findAll(user_id);

	if (!projects) {
		throw new NotFoundError();
	}

	const response = new SuccessResponse({
		message: projectMessage.success.getProject,
		data: projects
	});

	res.status(200).send(response.body);
};

export { getAllProjects };
