import { db } from '../db';

export interface NoteModel {
	note_id: number;
	task_id: number;
	project_id: number;
	user_id: number;
	title: string;
	description: string;
	start: Date;
	end: Date;
	hours: number;
	tags: string;
	pinned: boolean;
	created_at: Date;
	updated_at: Date;
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
		let tagString;
		if (tags) {
			tagString = tags.join(',');
		}

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
				tags: tagString || null,
				pinned
			})
			.returning('*');

		return note[0];
	};

	static find = async (
		searchCriteria: SearchCriteria
	): Promise<NoteModel> => {
		const note = await db.select('*').from('notes').where(searchCriteria);
		return note[0];
	};

	static findAll = async (userId: string): Promise<NoteModel[]> => {
		const notes = await db
			.select('*')
			.from('notes')
			.where({ user_id: userId });

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

		return note[0];
	};

	static delete = async (noteId: string) => {
		await db('notes').del().where({ note_id: noteId });
	};
}

export { Note };
