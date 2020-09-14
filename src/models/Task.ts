import { db } from '../db';

export interface TaskModel {
	task_id: number;
	project_id: number;
	user_id: number;
	title: string;
	description: string;
	tags: string[];
	pinned: boolean;
	notes: number;
	hours: number;
	created_at: Date;
	updated_at: Date;
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

class Task {
	static create = async ({
		title,
		description,
		projectId,
		userId,
		tags,
		pinned
	}: NewTask): Promise<TaskModel> => {
		let tagString;
		if (tags) {
			tagString = tags.join(',');
		}

		const task = await db('tasks')
			.insert({
				title,
				description,
				user_id: userId,
				project_id: projectId,
				tags: tagString || null,
				pinned
			})
			.returning('*');

		return task[0];
	};

	static find = async (
		searchCriteria: SearchCriteria
	): Promise<TaskModel> => {
		const task = await db.select('*').from('tasks').where(searchCriteria);
		return task[0];
	};

	static findAll = async (userId: string): Promise<TaskModel[]> => {
		const tasks = await db
			.select('*')
			.from('tasks')
			.where({ user_id: userId });

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

		return task[0];
	};

	static delete = async (taskId: string) => {
		await db('tasks').del().where({ task_id: taskId });
	};
}

export { Task };
