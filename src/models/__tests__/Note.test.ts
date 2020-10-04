import { Note } from '../Note';
import { Task } from '../Task';
import { Project } from '../Project';
import { createTestData } from '../../test/setup';

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

describe('Move Note', () => {
	it('moves a note to new task', async () => {
		const { task1, task2, note1, userId } = await createTestData();

		expect(task1.notes).toEqual(2);
		expect(task1.hours).toEqual(2);

		await Note.moveToNewTask(note1, task2.taskId.toString(), 1);

		const updatedNote = await Note.find({ note_id: note1.noteId });
		const startingTask = await Task.find({
			task_id: task1.taskId
		});
		const destinationTask = await Task.find({
			task_id: task2.taskId
		});

		expect(updatedNote.projectId).toEqual(destinationTask.projectId);
		expect(startingTask.notes).toEqual(1);
		expect(startingTask.hours).toEqual(1);
		expect(destinationTask.notes).toEqual(1);
		expect(destinationTask.hours).toEqual(1);
	});

	it('moves a note to new project', async () => {
		const {
			project1,
			project2,
			task1,
			task3,
			note1
		} = await createTestData();

		expect(project1.notes).toEqual(2);
		expect(project1.hours).toEqual(2);

		expect(project2.notes).toEqual(0);
		expect(project2.hours).toEqual(0);

		// Move new task data first
		await Note.moveToNewTask(note1, task3.taskId.toString(), 1);
		await Note.moveToNewProject(note1, project2.projectId.toString(), 1, {
			updateNoteTotals: true,
			updateHours: true
		});

		const updatedNote = await Note.find({ note_id: note1.noteId });
		const startingProject = await Project.find({
			project_id: project1.projectId
		});
		const destinationProject = await Project.find({
			project_id: project2.projectId
		});

		expect(updatedNote.projectId).toEqual(destinationProject.projectId);
		expect(startingProject.notes).toEqual(1);
		expect(startingProject.hours).toEqual(1);
		expect(destinationProject.notes).toEqual(1);
		expect(destinationProject.hours).toEqual(1);
	});
});
