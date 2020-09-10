import { Request, Response } from 'express';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { taskMessage, projectMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';
import { Project } from '../../models/Project';

const deleteProject = async (req: Request, res: Response) => {
	const { projectId } = req.params;

	const project = await Project.find({ project_id: projectId });

	if (!project) {
		throw new NotFoundError();
	}

	await Project.delete(projectId);

	const response = new SuccessResponse({
		message: projectMessage.success.deleteProject,
		data: {}
	});

	res.status(200).send(response.body);
};

export { deleteProject };
