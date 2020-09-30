import { db } from '../db';
import { ItemService } from '../util/ItemService';

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
	updatedAt: 'updated_at'
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
			updatedAt: task[0].updated_at
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
			updatedAt: task[0].updated_at
		};
	};

	static delete = async (taskId: string) => {
		await db('tasks').del().where({ task_id: taskId });
	};
}

export { Task };
