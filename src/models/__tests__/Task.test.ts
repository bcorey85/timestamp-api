import { Task } from '../Task';
import { Project } from '../Project';
import { createTestData } from '../../test/setup';

import { createTestTask, createTestUser, testTaskBody } from '../../test/setup';

describe('Create Task', () => {
	it('should create a task in database ', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newTask = await testTaskBody(userId);

		await Task.create({ ...newTask });

		const tasks = await Task.findAll({ user_id: userId });
		expect(tasks.length).toBe(1);
		expect(tasks[0].title).toEqual(newTask.title);
		expect(tasks[0].description).toEqual(newTask.description);
		expect(tasks[0].projectId).toEqual(Number(newTask.projectId));
		expect(tasks[0].userId).toEqual(Number(newTask.userId));
		expect(tasks[0].pinned).toEqual(newTask.pinned);
		expect(tasks[0].tags).toEqual(newTask.tags.join(','));
	});
});

describe('Find Task', () => {
	it('should return a task if valid criteria supplied', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newTask = await testTaskBody(userId);

		const { taskId } = await Task.create({ ...newTask });

		const task = await Task.find({ task_id: taskId });
		expect(task.title).toEqual(newTask.title);
		expect(task.description).toEqual(newTask.description);
		expect(task.projectId).toEqual(Number(newTask.projectId));
		expect(task.userId).toEqual(Number(newTask.userId));
		expect(task.pinned).toEqual(newTask.pinned);
		expect(task.tags).toEqual(newTask.tags.join(','));
	});
});

describe('Find All Tasks', () => {
	it('should return a list of tasks', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newTask = await testTaskBody(userId);

		const taskOne = await createTestTask(newTask);
		const taskTwo = await createTestTask(newTask);
		const taskThree = await createTestTask(newTask);

		const tasks = await Task.findAll({ user_id: userId });
		expect(tasks.length).toEqual(3);
	});
});

describe('Update Task', () => {
	it('updates task in db', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newTask = await testTaskBody(userId);

		const { taskId } = await createTestTask(newTask);

		const newTitle = 'test3';
		await Task.update(userId, {
			title: newTitle
		});

		const updatedTask = await Task.find({
			task_id: taskId
		});

		expect(updatedTask.title).toBe(newTitle);
	});
});

describe('Delete Task', () => {
	it('should delete task from db', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newTask = await testTaskBody(userId);

		const { taskId } = await createTestTask(newTask);

		await Task.delete(taskId.toString());

		const tasks = await Task.findAll({ user_id: userId });

		expect(tasks).toStrictEqual([]);
	});
});

describe('Move Task', () => {
	it('moves a task to new project', async () => {
		const { project1, project2, task1 } = await createTestData();

		expect(project1.tasks).toEqual(2);
		expect(project1.notes).toEqual(2);
		expect(project1.hours).toEqual(2);

		expect(project2.tasks).toEqual(0);
		expect(project2.notes).toEqual(0);
		expect(project2.hours).toEqual(0);

		await Task.moveToNewProject(task1, project2.projectId.toString());

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
});
