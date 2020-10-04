import request from 'supertest';

import { db } from '../db';
import { Project, NewProject } from '../models/Project';
import { User } from '../models/User';
import { Task, NewTask } from '../models/Task';
import { Note, NewNote } from '../models/Note';

jest.mock('../util/sendEmail');

beforeAll(async () => {
	await db.migrate.latest();
});

beforeEach(async () => {
	jest.clearAllMocks();
	await db.migrate.latest();
});

afterEach(async () => {
	await db.migrate.rollback();
});

afterAll(async () => {
	await db.destroy();
});

export const createTestUser = async (email: string, password: string) => {
	const { userId } = await User.create(email, password);
	const token = await User.generateAuthToken(userId);

	return { email, password, userId, token };
};

export const createTestProject = async ({
	title,
	description,
	userId,
	pinned
}: NewProject) => {
	const project = await Project.create({
		title,
		description,
		userId,
		pinned
	});

	return project;
};

export const createTestTask = async ({
	title,
	description,
	projectId,
	userId,
	pinned,
	tags
}: NewTask) => {
	const task = await Task.create({
		title,
		description,
		projectId,
		userId,
		pinned,
		tags
	});

	return task;
};

export const createTestNote = async ({
	title,
	description,
	projectId,
	taskId,
	userId,
	pinned,
	hours,
	startTime,
	endTime,
	tags
}: NewNote) => {
	const note = await Note.create({
		title,
		description,
		projectId,
		taskId,
		userId,
		pinned,
		hours,
		startTime,
		endTime,
		tags
	});

	return note;
};

export const createTestData = async () => {
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

export const testNoteBody = async (userId: string) => {
	const { projectId } = await createTestProject({
		title: 'test',
		description: 'test',
		userId: userId,
		pinned: false
	});

	const { taskId } = await createTestTask({
		title: 'test',
		description: 'test',
		userId: userId,
		projectId: projectId.toString(),
		pinned: false,
		tags: [ '#tag1', '#tag2' ]
	});

	return {
		title: 'test',
		description: 'test',
		projectId: projectId.toString(),
		taskId: taskId.toString(),
		userId: userId,
		pinned: false,
		hours: 1,
		startTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
		endTime: new Date(Date.now()).toISOString(),
		tags: [ '#tag1', '#tag2' ]
	};
};

export const testTaskBody = async (userId: string) => {
	const { projectId } = await createTestProject({
		title: 'test',
		description: 'test',
		userId: userId,
		pinned: false
	});

	return {
		title: 'test',
		description: 'test',
		projectId: projectId.toString(),
		userId: userId,
		pinned: false,
		tags: [ '#tag1', '#tag2' ]
	};
};
