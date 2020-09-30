import { Note } from '../../models/Note';
import { Project } from '../../models/Project';
import { Task } from '../../models/Task';
import {
	createTestProject,
	createTestUser,
	createTestTask,
	createTestNote
} from '../../test/setup';
import { ItemService } from '../ItemService';

const createTestData = async () => {
	const { userId } = await createTestUser('test@gmail.com', '111111');

	const project1 = await createTestProject({
		title: 'test project 1',
		description: 'test',
		userId,
		pinned: true
	});

	const project2 = await createTestProject({
		title: 'test project 2',
		description: 'test',
		userId,
		pinned: true
	});

	const task1 = await createTestTask({
		title: 'test task 1',
		description: 'test',
		projectId: project1.projectId.toString(),
		tags: [],
		userId,
		pinned: true
	});

	const task2 = await createTestTask({
		title: 'test task 2',
		description: 'test',
		projectId: project1.projectId.toString(),
		tags: [],
		userId,
		pinned: true
	});

	const task3 = await createTestTask({
		title: 'test task 3',
		description: 'test',
		projectId: project2.projectId.toString(),
		tags: [],
		userId,
		pinned: true
	});

	const note1 = await createTestNote({
		title: 'test note 1',
		description: 'test',
		projectId: project1.projectId.toString(),
		taskId: task1.taskId.toString(),
		tags: [],
		startTime: new Date().toISOString(),
		endTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
		hours: 1,
		userId,
		pinned: true
	});

	const note2 = await createTestNote({
		title: 'test note 2',
		description: 'test',
		projectId: project1.projectId.toString(),
		taskId: task1.taskId.toString(),
		tags: [],
		startTime: new Date().toISOString(),
		endTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
		hours: 1,
		userId,
		pinned: true
	});

	const updatedProject1 = await Project.update(project1.projectId, {
		tasks: 2,
		notes: 2,
		hours: 2
	});

	const updatedTask1 = await Task.update(task1.taskId, {
		notes: 2,
		hours: 2
	});

	return {
		userId,
		project1: updatedProject1,
		project2,
		task1: updatedTask1,
		task2,
		task3,
		note1,
		note2
	};
};

describe('ItemService', () => {
	it('merges tag array into string if present', () => {
		const tags = [ '#1', '#2', '#3' ];

		const merged = ItemService.mergeTags(tags);

		expect(merged).toEqual('#1,#2,#3');
	});

	it('returns null if no tags passed', () => {
		const tags = null;

		const merged = ItemService.mergeTags(tags);

		expect(merged).toEqual(null);
	});

	it('calculates hours between start and end date time strings', () => {
		const start = new Date().toISOString();
		const end = new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString();

		const hours = ItemService.calcHours(start, end);

		expect(hours).toEqual(5);
	});

	it('moves a task to new project', async () => {
		const { project1, project2, task1 } = await createTestData();

		expect(project1.tasks).toEqual(2);
		expect(project1.notes).toEqual(2);
		expect(project1.hours).toEqual(2);

		expect(project2.tasks).toEqual(0);
		expect(project2.notes).toEqual(0);
		expect(project2.hours).toEqual(0);

		await ItemService.moveTaskToNewProject(
			task1,
			project2.projectId.toString()
		);

		const updatedTask = await Task.find({ task_id: task1.taskId });
		const startingProject = await Project.find({
			project_id: project1.projectId
		});
		const destinationProject = await Project.find({
			project_id: project2.projectId
		});

		expect(updatedTask.projectId).toEqual(destinationProject.projectId);
		expect(startingProject.tasks).toEqual(1);
		expect(startingProject.notes).toEqual(0);
		expect(startingProject.hours).toEqual(0);
		expect(destinationProject.tasks).toEqual(1);
		expect(destinationProject.notes).toEqual(2);
		expect(destinationProject.hours).toEqual(2);
	});

	it('moves a note to new task', async () => {
		const { task1, task2, note1, userId } = await createTestData();

		expect(task1.notes).toEqual(2);
		expect(task1.hours).toEqual(2);

		await ItemService.moveNoteToNewTask(note1, task2.taskId.toString(), 1);

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
		await ItemService.moveNoteToNewTask(note1, task3.taskId.toString(), 1);
		await ItemService.moveNoteToNewProject(
			note1,
			project2.projectId.toString(),
			1,
			{ updateNoteTotals: true, updateHours: true }
		);

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
