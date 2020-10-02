import { Request, Response } from 'express';
import { Note } from '../../models/Note';
import { Project, ProjectModel } from '../../models/Project';
import { Task } from '../../models/Task';
import { BadRequestError } from '../../responses/errors/BadRequestError';
import { NotFoundError } from '../../responses/errors/NotFoundError';
import {
	genericMessage,
	projectMessage
} from '../../responses/responseStrings';
import { SuccessResponse } from '../../responses/SuccessResponse';

const handleCompleteProject = async (project: ProjectModel) => {
	const childTasks = await Task.findAll({
		project_id: project.projectId
	});

	const childNotes = await Note.findAll({
		project_id: project.projectId
	});

	if (project.completedOn === null) {
		await Project.update(project.projectId, {
			completed_on: new Date().toISOString(),
			completed_by: 'user'
		});

		// Flag child items as complete, but differentiate from user completion
		childTasks.map(async task => {
			if (task.completedBy === null) {
				await Task.update(task.taskId, {
					completed_on: new Date().toISOString(),
					completed_by: 'project'
				});
			}
		});
		childNotes.map(async note => {
			if (note.completedBy === null) {
				await Note.update(note.noteId, {
					completed_on: new Date().toISOString(),
					completed_by: 'project'
				});
			}
		});
	} else {
		await Project.update(project.projectId, {
			completed_on: null,
			completed_by: null
		});
		const childTasks = await Task.findAll({
			project_id: project.projectId
		});
		// Remove completion status from project complete request
		childTasks.map(async task => {
			if (task.completedBy === 'project') {
				await Task.update(task.taskId, {
					completed_on: null,
					completed_by: null
				});
			}
		});
		childNotes.map(async note => {
			if (note.completedBy === 'project') {
				await Note.update(note.noteId, {
					completed_on: null,
					completed_by: null
				});
			}
		});
	}
};

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
		await handleCompleteProject(project);

		const response = new SuccessResponse({
			message: projectMessage.success.completeProject,
			data: {}
		});

		return res.status(200).send(response.body);
	}
};

export { projectActions };
