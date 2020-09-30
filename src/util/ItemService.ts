import { DateTimeService } from './DateTimeService';
import { Task, TaskModel } from '../models/Task';
import { Project, ProjectModel } from '../models/Project';
import { Note, NoteModel } from '../models/Note';
import { NotFoundError } from '../responses/errors/NotFoundError';

class ItemService {
	static mergeTags = (tags: string[] | null) => {
		if (!tags) {
			return null;
		}

		return tags.join(',');
	};

	static calcHours = (startTime: string, endTime: string) => {
		const startDate = DateTimeService.parse(startTime);
		const endDate = DateTimeService.parse(endTime);

		return DateTimeService.getHours(startDate, endDate);
	};

	static moveNoteToNewTask = async (
		note: NoteModel,
		taskId: string,
		hours: number
	) => {
		const previousTaskId = note.taskId;
		const previousTask = await Task.find({ task_id: previousTaskId });
		if (!previousTask) {
			throw new NotFoundError();
		}

		const updatedPrevious = await Task.update(previousTaskId, {
			hours: previousTask.hours - hours,
			notes: previousTask.notes - 1
		});

		const newTask = await Task.find({ task_id: taskId });
		if (!newTask) {
			throw new NotFoundError();
		}

		const updatedNext = await Task.update(taskId, {
			hours: newTask.hours + hours,
			notes: newTask.notes + 1
		});

		await Note.update(note.noteId, {
			task_id: taskId
		});
	};

	static moveNoteToNewProject = async (
		note: NoteModel,
		projectId: string,
		hours: number,
		{
			updateNoteTotals,
			updateHours
		}: { updateNoteTotals: boolean; updateHours: boolean }
	) => {
		const previousProjectId = note.projectId;
		const previousProject = await Project.find({
			project_id: previousProjectId
		});
		if (!previousProject) {
			throw new NotFoundError();
		}

		await Project.update(previousProjectId, {
			hours: updateHours
				? previousProject.hours - hours
				: previousProject.hours,
			notes: updateNoteTotals
				? previousProject.notes - 1
				: previousProject.notes
		});

		const newProject = await Project.find({ project_id: projectId });
		if (!newProject) {
			throw new NotFoundError();
		}

		await Project.update(projectId, {
			hours: updateHours ? newProject.hours + hours : newProject.hours,
			notes: updateNoteTotals ? newProject.notes + 1 : newProject.notes
		});

		await Note.update(note.noteId, {
			project_id: projectId
		});
	};

	static moveTaskToNewProject = async (
		task: TaskModel,
		projectId: string
	) => {
		const previousProjectId = task.projectId;
		const previousProject = await Project.find({
			project_id: previousProjectId
		});
		if (!previousProject) {
			throw new NotFoundError();
		}

		await Project.update(previousProjectId, {
			tasks: previousProject.tasks - 1,
			notes: previousProject.notes - task.notes,
			hours: previousProject.hours - task.hours
		});

		const newProject = await Project.find({ project_id: projectId });
		if (!newProject) {
			throw new NotFoundError();
		}

		const taskNoteArray = await Note.findAll({ task_id: task.taskId });
		for (const note of taskNoteArray) {
			ItemService.moveNoteToNewProject(note, projectId, note.hours, {
				updateNoteTotals: false,
				updateHours: false
			});
		}

		await Project.update(projectId, {
			tasks: newProject.tasks + 1,
			notes: newProject.notes + task.notes,
			hours: newProject.hours + task.hours
		});

		await Task.update(task.taskId, {
			project_id: projectId
		});
	};
}

export { ItemService };
