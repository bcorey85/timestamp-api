import { Request, Response } from 'express';
import { Project } from '../../models/Project';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { projectMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';

const updateProject = async (req: Request, res: Response) => {
	const { projectId } = req.params;
	const { title, description, pinned } = req.body;

	const project = await Project.find({ project_id: projectId });

	if (!project) {
		throw new NotFoundError();
	}

	await Project.update(projectId, {
		title,
		description,
		pinned,
		updated_at: new Date(Date.now())
	});

	const response = new SuccessResponse({
		message: projectMessage.success.updateProject,
		data: {}
	});

	res.status(200).send(response.body);
};

export { updateProject };
