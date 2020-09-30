import { db } from '../db';
import { ItemService } from '../util/ItemService';

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
	updatedAt: 'updated_at'
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
			updatedAt: note[0].updated_at
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
			updatedAt: note[0].updated_at
		};
	};

	static delete = async (noteId: string) => {
		await db('notes').del().where({ note_id: noteId });
	};
}

export { Note };
