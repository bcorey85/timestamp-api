import { Request, Response } from 'express';

import { SuccessResponse } from '../../responses/SuccessResponse';
import { createMessage } from '../../responses/responseStrings';
import { User } from '../../models/User';
import { Note } from '../../models/Note';
import { Project } from '../../models/Project';
import { Task } from '../../models/Task';
import { DateTimeService } from '../../util/DateTimeService';
import { NotFoundError } from '../../responses/errors/NotFoundError';

const createNote = async (req: Request, res: Response) => {
	const { userId } = req.params;
	const {
		title,
		description,
		projectId,
		taskId,
		tags,
		startTime,
		endTime,
		pinned
	} = req.body;

	const startDate = DateTimeService.parse(startTime);
	const endDate = DateTimeService.parse(endTime);

	const hours = DateTimeService.getHours(startDate, endDate);

	const project = await Project.find({ project_id: projectId });
	const task = await Task.find({ task_id: taskId });

	await Project.update(projectId, {
		hours: project.hours + hours,
		notes: project.notes + 1
	});
	await Task.update(taskId, {
		hours: task.hours + hours,
		notes: task.notes + 1
	});

	const user = await User.find({ user_id: userId });

	if (!user) {
		throw new NotFoundError();
	}

	await Note.create({
		title,
		description,
		projectId,
		userId: userId,
		taskId,
		tags,
		startTime: startDate.toISOString(),
		endTime: endDate.toISOString(),
		hours,
		pinned
	});

	const response = new SuccessResponse({
		message: createMessage.success.note,
		data: {}
	});

	res.status(201).send(response.body);
};

export { createNote };
