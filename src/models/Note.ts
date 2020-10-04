import { db } from '../db';
import { ItemService } from '../util/ItemService';
import { Task } from './Task';
import { Project } from './Project';
import { NotFoundError } from '../responses/errors/NotFoundError';

export interface NoteModel {
	noteId: number;
	taskId: number;
	projectId: number;
	userId: number;
	title: string;
	description: string;
	startTime: Date;
	endTime: Date;
	hours: number;
	tags: string;
	pinned: boolean;
	createdAt: Date;
	updatedAt: Date;
	completedOn: Date;
	completedBy: string;
}

export interface NewNote {
	title: string;
	description: string;
	projectId: string;
	taskId: string;
	userId: string;
	startTime: string;
	endTime: string;
	hours: number;
	tags: string[];
	pinned: boolean;
}

interface SearchCriteria {
	[key: string]: any;
}

interface Update {
	[key: string]: any;
}

const noteAliases = {
	noteId: 'note_id',
	taskId: 'task_id',
	projectId: 'project_id',
	userId: 'user_id',
	title: 'title',
	description: 'description',
	startTime: 'start_time',
	endTime: 'end_time',
	hours: 'hours',
	tags: 'tags',
	pinned: 'pinned',
	createdAt: 'created_at',
	updatedAt: 'updated_at',
	completedOn: 'completed_on',
	completedBy: 'completed_by'
};

class Note {
	static create = async ({
		title,
		description,
		projectId,
		taskId,
		userId,
		startTime,
		endTime,
		hours,
		tags,
		pinned
	}: NewNote): Promise<NoteModel> => {
		const note = await db('notes')
			.insert({
				title,
				description,
				user_id: userId,
				project_id: projectId,
				task_id: taskId,
				start_time: startTime,
				end_time: endTime,
				hours,
				tags: ItemService.mergeTags(tags),
				pinned
			})
			.returning('*');

		return {
			noteId: note[0].note_id,
			taskId: note[0].task_id,
			projectId: note[0].project_id,
			userId: note[0].user_id,
			title: note[0].title,
			description: note[0].description,
			startTime: note[0].start_time,
			endTime: note[0].end_time,
			hours: note[0].hours,
			tags: note[0].tags,
			pinned: note[0].pinned,
			createdAt: note[0].created_at,
			updatedAt: note[0].updated_at,
			completedOn: note[0].completed_on,
			completedBy: note[0].completed_by
		};
	};

	static find = async (
		searchCriteria: SearchCriteria
	): Promise<NoteModel> => {
		const note = await db
			.select(noteAliases)
			.from('notes')
			.where(searchCriteria);
		return note[0];
	};

	static findAll = async (
		searchCriteria: SearchCriteria
	): Promise<NoteModel[]> => {
		const notes = await db
			.select(noteAliases)
			.from('notes')
			.where(searchCriteria);

		return notes;
	};

	static update = async (
		noteId: string | number,
		update: Update
	): Promise<NoteModel> => {
		const note = await db('notes')
			.update(update)
			.where({ note_id: noteId })
			.returning('*');

		return {
			noteId: note[0].note_id,
			taskId: note[0].task_id,
			projectId: note[0].project_id,
			userId: note[0].user_id,
			title: note[0].title,
			description: note[0].description,
			startTime: note[0].start_time,
			endTime: note[0].end_time,
			hours: note[0].hours,
			tags: note[0].tags,
			pinned: note[0].pinned,
			createdAt: note[0].created_at,
			updatedAt: note[0].updated_at,
			completedOn: note[0].completed_on,
			completedBy: note[0].completed_by
		};
	};

	static delete = async (noteId: string) => {
		await db('notes').del().where({ note_id: noteId });
	};

	static moveToNewTask = async (
		note: NoteModel,
		taskId: string,
		hours: number
	) => {
		const previousTaskId = note.taskId;
		const previousTask = await Task.find({ task_id: previousTaskId });
		if (!previousTask) {
			throw new NotFoundError();
		}

		await Task.update(previousTaskId, {
			hours: previousTask.hours - hours,
			notes: previousTask.notes - 1
		});

		const newTask = await Task.find({ task_id: taskId });
		if (!newTask) {
			throw new NotFoundError();
		}

		await Task.update(taskId, {
			hours: newTask.hours + hours,
			notes: newTask.notes + 1
		});

		await Note.update(note.noteId, {
			task_id: taskId
		});
	};

	static moveToNewProject = async (
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
}

export { Note };
