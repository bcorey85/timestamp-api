import { Request, Response } from 'express';
import { Note, NoteModel } from '../../models/Note';
import { Task } from '../../models/Task';
import { Project } from '../../models/Project';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { noteMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';
import { DateTimeService } from '../../util/DateTimeService';
import { ItemService } from '../../util/ItemService';

const handleNoteMoveCheck = async (
	note: NoteModel,
	projectId: string,
	taskId: string,
	hours: number
) => {
	const moveToNewProject = projectId !== note.projectId.toString();
	const moveToNewTask = taskId !== note.taskId.toString();
	if (moveToNewProject) {
		Note.moveToNewTask(note, taskId, hours);
		Note.moveToNewProject(note, projectId, hours, {
			updateNoteTotals: true,
			updateHours: true
		});
	} else if (!moveToNewProject && moveToNewTask) {
		Note.moveToNewTask(note, taskId, hours);
	} else {
		const task = await Task.find({ task_id: note.taskId });
		if (!task) {
			throw new NotFoundError();
		}

		const project = await Project.find({ project_id: note.projectId });
		if (!project) {
			throw new NotFoundError();
		}

		await Task.update(note.taskId, {
			hours: task.hours - note.hours + hours,
			updated_at: new Date(Date.now())
		});

		await Project.update(note.projectId, {
			hours: project.hours - note.hours + hours,
			updated_at: new Date(Date.now())
		});
	}
};

const updateNote = async (req: Request, res: Response) => {
	const { noteId } = req.params;

	const {
		title,
		startTime,
		endTime,
		description,
		tags,
		pinned,
		projectId,
		taskId
	} = req.body;

	const note = await Note.find({ note_id: noteId });
	if (!note) {
		throw new NotFoundError();
	}

	const hours = ItemService.calcHours(startTime, endTime);
	const tagString = ItemService.mergeTags(tags);

	handleNoteMoveCheck(note, projectId, taskId, hours);

	await Note.update(noteId, {
		title,
		description,
		tags: tagString,
		start_time: DateTimeService.parse(startTime).toISOString(),
		end_time: DateTimeService.parse(endTime).toISOString(),
		hours,
		pinned,
		updated_at: new Date(Date.now())
	});

	const response = new SuccessResponse({
		message: noteMessage.success.updateNote,
		data: {}
	});

	res.status(200).send(response.body);
};

export { updateNote };
