import { db } from '../db';

export interface ProjectModel {
	project_id: number;
	user_id: number;
	title: string;
	description: string;
	pinned: boolean;
	notes: number;
	tasks: number;
	hours: number;
	created_at: Date;
	updated_at: Date;
}

export interface NewProject {
	title: string;
	description: string;
	pinned: boolean;
	userId: string;
}

interface SearchCriteria {
	[key: string]: any;
}

interface Update {
	[key: string]: any;
}

class Project {
	static create = async ({
		title,
		description,
		pinned,
		userId
	}: NewProject): Promise<ProjectModel> => {
		const project = await db('projects')
			.insert({ title, description, pinned, user_id: userId })
			.returning('*');

		return project[0];
	};

	static find = async (
		searchCriteria: SearchCriteria
	): Promise<ProjectModel> => {
		const project = await db
			.select('*')
			.from('projects')
			.where(searchCriteria);
		return project[0];
	};

	static findAll = async (userId: string): Promise<ProjectModel[]> => {
		const projects = await db
			.select('*')
			.from('projects')
			.where({ user_id: userId });

		return projects;
	};

	static update = async (
		projectId: string | number,
		update: Update
	): Promise<ProjectModel> => {
		const project = await db('projects')
			.update(update)
			.where({ project_id: projectId })
			.returning('*');

		return project[0];
	};

	static delete = async (projectId: string) => {
		await db('projects').del().where({ project_id: projectId });
	};
}

export { Project };
