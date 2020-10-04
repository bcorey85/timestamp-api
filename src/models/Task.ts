import { db } from '../db';
import { ItemService } from '../util/ItemService';
import { Note, NoteModel } from './Note';
import { Project } from './Project';
import { NotFoundError } from '../responses/errors/NotFoundError';

export interface TaskModel {
	taskId: number;
	projectId: number;
	userId: number;
	title: string;
	description: string;
	tags: string[];
	pinned: boolean;
	notes: number;
	hours: number;
	createdAt: Date;
	updatedAt: Date;
	completedOn: Date;
	completedBy: string;
}

export interface NewTask {
	title: string;
	description: string;
	projectId: string;
	userId: string;
	tags: string[];
	pinned: boolean;
}

interface SearchCriteria {
	[key: string]: any;
}

interface Update {
	[key: string]: any;
}

const taskAliases = {
	taskId: 'task_id',
	projectId: 'project_id',
	userId: 'user_id',
	title: 'title',
	description: 'description',
	tags: 'tags',
	pinned: 'pinned',
	notes: 'notes',
	hours: 'hours',
	createdAt: 'created_at',
	updatedAt: 'updated_at',
	completedOn: 'completed_on',
	completedBy: 'completed_by'
};

class Task {
	static create = async ({
		title,
		description,
		projectId,
		userId,
		tags,
		pinned
	}: NewTask): Promise<TaskModel> => {
		const task = await db('tasks')
			.insert({
				title,
				description,
				user_id: userId,
				project_id: projectId,
				tags: ItemService.mergeTags(tags),
				pinned
			})
			.returning('*');

		return {
			taskId: task[0].task_id,
			projectId: task[0].project_id,
			userId: task[0].user_id,
			title: task[0].title,
			description: task[0].description,
			tags: task[0].tags,
			pinned: task[0].pinned,
			notes: task[0].notes,
			hours: task[0].hours,
			createdAt: task[0].created_at,
			updatedAt: task[0].updated_at,
			completedOn: task[0].completed_on,
			completedBy: task[0].completed_by
		};
	};

	static find = async (
		searchCriteria: SearchCriteria
	): Promise<TaskModel> => {
		const task = await db
			.select(taskAliases)
			.from('tasks')
			.where(searchCriteria);
		return task[0];
	};

	static findAll = async (
		searchCriteria: SearchCriteria
	): Promise<TaskModel[]> => {
		const tasks = await db
			.select(taskAliases)
			.from('tasks')
			.where(searchCriteria);

		return tasks;
	};

	static update = async (
		taskId: string | number,
		update: Update
	): Promise<TaskModel> => {
		const task = await db('tasks')
			.update(update)
			.where({ task_id: taskId })
			.returning('*');

		return {
			taskId: task[0].task_id,
			projectId: task[0].project_id,
			userId: task[0].user_id,
			title: task[0].title,
			description: task[0].description,
			tags: task[0].tags,
			pinned: task[0].pinned,
			notes: task[0].notes,
			hours: task[0].hours,
			createdAt: task[0].created_at,
			updatedAt: task[0].updated_at,
			completedOn: task[0].completed_on,
			completedBy: task[0].completed_by
		};
	};

	static delete = async (taskId: string) => {
		await db('tasks').del().where({ task_id: taskId });
	};

	static moveToNewProject = async (task: TaskModel, projectId: string) => {
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
			Note.moveToNewProject(note, projectId, note.hours, {
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

	static complete = async (task: TaskModel, completedBy: string) => {
		if (task.completedOn === null) {
			await Task.update(task.taskId, {
				completed_on: new Date().toISOString(),
				completed_by: completedBy
			});
		} else {
			await Task.update(task.taskId, {
				completed_on: null,
				completed_by: null
			});
		}
	};

	static completeChildNotes = async (task: TaskModel, notes: NoteModel[]) => {
		if (task.completedOn === null) {
			// Flag child items as complete, but differentiate from user completion
			notes.map(async note => {
				if (note.completedOn === null) {
					await Note.update(note.noteId, {
						completed_on: new Date().toISOString(),
						completed_by: 'task'
					});
				}
			});
		} else {
			// Remove completion status from task complete request
			notes.map(async note => {
				if (note.completedBy === 'task') {
					await Note.update(note.noteId, {
						completed_on: null,
						completed_by: null
					});
				}
			});
		}
	};
}

export { Task };
