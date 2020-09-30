import { Project } from '../Project';

import { createTestProject, createTestUser } from '../../test/setup';

describe('Create Task', () => {
	it('should create a task in database ', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newProject = {
			title: 'test',
			description: 'test',
			pinned: true,
			userId
		};

		await Project.create({ ...newProject });

		const projects = await Project.findAll({ user_id: userId });
		expect(projects.length).toBe(1);
		expect(projects[0].title).toEqual(newProject.title);
		expect(projects[0].description).toEqual(newProject.description);
		expect(projects[0].pinned).toEqual(newProject.pinned);
	});
});

describe('Find Project', () => {
	it('should return a project if valid criteria supplied', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newProject = {
			title: 'test',
			description: 'test',
			pinned: true,
			userId
		};

		const { projectId } = await Project.create({ ...newProject });

		const project = await Project.find({ project_id: projectId });
		expect(project.title).toEqual(newProject.title);
		expect(project.description).toEqual(newProject.description);
		expect(project.pinned).toEqual(newProject.pinned);
	});
});

describe('Find All Projects', () => {
	it('should return a list of projects', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newProject = {
			title: 'test',
			description: 'test',
			pinned: true,
			userId
		};

		const projectOne = await Project.create({ ...newProject });
		const projectTwo = await Project.create({ ...newProject });
		const projectThree = await Project.create({ ...newProject });

		const projects = await Project.findAll({ user_id: userId });
		expect(projects.length).toBe(3);
	});
});

describe('Update Task', () => {
	it('updates task in db', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newProject = {
			title: 'test',
			description: 'test',
			pinned: true,
			userId
		};

		const { projectId } = await Project.create({ ...newProject });

		const newTitle = 'test3';
		await Project.update(userId, { title: newTitle });

		const project = await Project.find({ project_id: projectId });
		expect(project.title).toEqual(newTitle);
	});
});

describe('Delete Task', () => {
	it('should delete user from db', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const newProject = {
			title: 'test',
			description: 'test',
			pinned: true,
			userId
		};

		const { projectId } = await Project.create({ ...newProject });

		await Project.delete(projectId.toString());

		const projects = await Project.findAll({ user_id: userId });

		expect(projects).toStrictEqual([]);
	});
});
