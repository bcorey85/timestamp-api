import { Request, Response } from 'express';
import { Project } from '../../models/Project';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { projectMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';

const getProjectById = async (req: Request, res: Response) => {
	const project = await Project.find({ project_id: req.params.projectId });

	if (!project) {
		throw new NotFoundError();
	}

	const response = new SuccessResponse({
		message: projectMessage.success.getProject,
		data: project
	});

	res.status(200).send(response.body);
};

export { getProjectById };
