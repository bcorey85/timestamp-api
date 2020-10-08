import { db } from '../db';
import { Note, NoteModel } from './Note';
import { Task, TaskModel } from './Task';

export interface ProjectModel {
	projectId: number;
	userId: number;
	title: string;
	description: string;
	pinned: boolean;
	notes: number;
	tasks: number;
	hours: number;
	createdAt: Date;
	updatedAt: Date;
	completedOn: Date | null;
	completedBy: string | null;
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

const projectAliases = {
	projectId: 'project_id',
	userId: 'user_id',
	title: 'title',
	description: 'description',
	pinned: 'pinned',
	hours: 'hours',
	tasks: 'tasks',
	notes: 'notes',
	createdAt: 'created_at',
	updatedAt: 'updated_at',
	completedOn: 'completed_on',
	completedBy: 'completed_by'
};

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

		return {
			projectId: project[0].project_id,
			userId: project[0].user_id,
			title: project[0].title,
			description: project[0].description,
			pinned: project[0].pinned,
			hours: project[0].hours,
			tasks: project[0].tasks,
			notes: project[0].notes,
			createdAt: project[0].created_at,
			updatedAt: project[0].updated_at,
			completedOn: project[0].completed_on,
			completedBy: project[0].completed_by
		};
	};

	static find = async (
		searchCriteria: SearchCriteria
	): Promise<ProjectModel> => {
		const project = await db
			.select(projectAliases)
			.from('projects')
			.where(searchCriteria);

		return project[0];
	};

	static findAll = async (
		searchCriteria: SearchCriteria
	): Promise<ProjectModel[]> => {
		const projects = await db
			.select(projectAliases)
			.from('projects')
			.where(searchCriteria);

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

		return {
			projectId: project[0].project_id,
			userId: project[0].user_id,
			title: project[0].title,
			description: project[0].description,
			pinned: project[0].pinned,
			hours: project[0].hours,
			tasks: project[0].tasks,
			notes: project[0].notes,
			createdAt: project[0].created_at,
			updatedAt: project[0].updated_at,
			completedOn: project[0].completed_on,
			completedBy: project[0].completed_by
		};
	};

	static delete = async (projectId: string) => {
		await db('projects').del().where({ project_id: projectId });
	};

	static complete = async (project: ProjectModel) => {
		if (project.completedOn === null) {
			await Project.update(project.projectId, {
				completed_on: new Date().toISOString(),
				completed_by: 'user'
			});
		} else {
			await Project.update(project.projectId, {
				completed_on: null,
				completed_by: null
			});
		}
	};

	static completeChildTasks = async (
		project: ProjectModel,
		childTasks: TaskModel[]
	) => {
		if (project.completedOn === null) {
			// Flag child items as complete, but differentiate from user completion
			childTasks.map(async task => {
				if (task.completedBy === null) {
					await Task.update(task.taskId, {
						completed_on: new Date().toISOString(),
						completed_by: 'project'
					});
				}
			});
		} else {
			// Remove completion status from project complete request
			childTasks.map(async task => {
				if (task.completedBy === 'project') {
					await Task.update(task.taskId, {
						completed_on: null,
						completed_by: null
					});
				}
			});
		}
	};

	static completeChildNotes = async (
		project: ProjectModel,
		childNotes: NoteModel[]
	) => {
		if (project.completedOn === null) {
			// Flag child items as complete, but differentiate from user completion
			childNotes.map(async note => {
				if (note.completedBy === null) {
					await Note.update(note.noteId, {
						completed_on: new Date().toISOString(),
						completed_by: 'project'
					});
				}
			});
		} else {
			childNotes.map(async note => {
				// Remove completion status from project complete request
				if (note.completedBy === 'project') {
					await Note.update(note.noteId, {
						completed_on: null,
						completed_by: null
					});
				}
			});
		}
	};
}

export { Project };
