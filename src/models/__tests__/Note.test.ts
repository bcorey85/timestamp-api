import { Note } from '../Note';

import { createTestNote, createTestUser, testNoteBody } from '../../test/setup';

describe('Create Note', () => {
	it('should create a note in database ', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newNote = await testNoteBody(userId);

		await Note.create({ ...newNote });

		const notes = await Note.findAll({ user_id: userId });

		expect(notes.length).toBe(1);
		expect(notes[0].title).toEqual(newNote.title);
		expect(notes[0].description).toEqual(newNote.description);
		expect(notes[0].projectId).toEqual(Number(newNote.projectId));
		expect(notes[0].taskId).toEqual(Number(newNote.taskId));
		expect(notes[0].userId).toEqual(Number(newNote.userId));
		expect(new Date(notes[0].startTime).toISOString()).toEqual(
			new Date(newNote.startTime).toISOString()
		);
		expect(new Date(notes[0].endTime).toISOString()).toEqual(
			new Date(newNote.endTime).toISOString()
		);
		expect(notes[0].pinned).toEqual(newNote.pinned);
		expect(notes[0].tags).toEqual(newNote.tags.join(','));
	});
});

describe('Find Note', () => {
	it('should return a note if valid criteria supplied', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newNote = await testNoteBody(userId);

		const { taskId } = await Note.create({ ...newNote });

		const note = await Note.find({ task_id: taskId });
		expect(note.title).toEqual(newNote.title);
		expect(note.description).toEqual(newNote.description);
		expect(note.projectId).toEqual(Number(newNote.projectId));
		expect(note.taskId).toEqual(Number(newNote.taskId));
		expect(note.userId).toEqual(Number(newNote.userId));
		expect(new Date(note.startTime).toISOString()).toEqual(
			new Date(newNote.startTime).toISOString()
		);
		expect(new Date(note.endTime).toISOString()).toEqual(
			new Date(newNote.endTime).toISOString()
		);
		expect(note.pinned).toEqual(newNote.pinned);
		expect(note.tags).toEqual(newNote.tags.join(','));
	});
});

describe('Find All Tasks', () => {
	it('should return a list of notes', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newNote = await testNoteBody(userId);

		const noteOne = await createTestNote(newNote);
		const noteTwo = await createTestNote(newNote);
		const noteThree = await createTestNote(newNote);

		const notes = await Note.findAll({ user_id: userId });
		expect(notes.length).toEqual(3);
	});
});

describe('Update Note', () => {
	it('updates note in db', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newNote = await testNoteBody(userId);

		const { taskId } = await createTestNote(newNote);

		const newTitle = 'test3';
		await Note.update(userId, {
			title: newTitle
		});

		const updatedNote = await Note.find({
			task_id: taskId
		});

		expect(updatedNote.title).toBe(newTitle);
	});
});

describe('Delete Note', () => {
	it('should delete note from db', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newNote = await testNoteBody(userId);

		const { noteId } = await createTestNote(newNote);

		await Note.delete(noteId.toString());

		const notes = await Note.findAll({ user_id: userId });

		expect(notes).toStrictEqual([]);
	});
});
