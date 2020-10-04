import { Request, Response } from 'express';
import { Note, NoteModel } from '../../models/Note';
import { Project, ProjectModel } from '../../models/Project';
import { Task, TaskModel } from '../../models/Task';
import { BadRequestError } from '../../responses/errors/BadRequestError';
import { NotFoundError } from '../../responses/errors/NotFoundError';
import {
	genericMessage,
	projectMessage
} from '../../responses/responseStrings';
import { SuccessResponse } from '../../responses/SuccessResponse';

const projectActions = async (req: Request, res: Response) => {
	const query = req.query;
	const { projectId } = req.params;

	if (!query) {
		return new BadRequestError(genericMessage.error.noActionQuery);
	}

	const project = await Project.find({ project_id: projectId });

	if (!project) {
		return new NotFoundError();
	}

	// Toggle completed status
	if (query.completed) {
		await Project.complete(project);

		const childTasks = await Task.findAll({
			project_id: project.projectId
		});
		const childNotes = await Note.findAll({
			project_id: project.projectId
		});

		await Project.completeChildTasks(project, childTasks);
		await Project.completeChildNotes(project, childNotes);

		const response = new SuccessResponse({
			message: projectMessage.success.completeProject,
			data: {}
		});

		return res.status(200).send(response.body);
	}
};

export { projectActions };
