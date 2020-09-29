import request from 'supertest';
import { app } from '../../../app';
import {
	authMessage,
	requestValidationMessage,
	projectMessage,
	genericMessage,
	createMessage
} from '../../../responses/responseStrings';
import { Project } from '../../../models/Project';
import { createTestUser, createTestProject } from '../../../test/setup';

describe('Update Project Controller', () => {
	it('updates project in db', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const project = await createTestProject({
			title: 'test',
			description: 'test',
			userId: userId,
			pinned: false
		});

		const update = {
			title: 'test2',
			description: 'test2',
			pinned: true
		};

		const { projectId } = await Project.find({ title: project.title });
		const response = await request(app)
			.put(`/api/projects/${userId}/${projectId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(update)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(
			projectMessage.success.updateProject
		);

		const updatedProject = await Project.find({ user_id: userId });

		expect(updatedProject.title).toEqual(update.title);
		expect(updatedProject.description).toEqual(update.description);
		expect(updatedProject.pinned).toEqual(update.pinned);
	});

	it('throws error if no title', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const project = await createTestProject({
			title: 'test',
			description: 'test',
			userId: userId,
			pinned: false
		});

		const update = {
			title: '',
			description: 'test2',
			pinned: true
		};

		const { projectId } = await Project.find({ title: project.title });
		const response = await request(app)
			.put(`/api/projects/${userId}/${projectId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(update)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			createMessage.error.title
		);

		const updatedProject = await Project.find({ user_id: userId });

		expect(updatedProject.title).not.toEqual(update.title);
	});

	it('throws error if not found', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const project = await createTestProject({
			title: 'test',
			description: 'test',
			userId: userId,
			pinned: false
		});

		const update = {
			title: 'test2',
			description: 'test2',
			pinned: true
		};

		const fakeProjectId = 500;
		const response = await request(app)
			.put(`/api/projects/${userId}/${fakeProjectId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(update)
			.expect(404);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notFound
		);

		const updatedProject = await Project.find({ user_id: userId });

		expect(updatedProject.title).toEqual(project.title);
		expect(updatedProject.description).toEqual(project.description);
		expect(updatedProject.pinned).toEqual(project.pinned);
	});

	it('throws error if not logged in', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');

		const project = await createTestProject({
			title: 'test',
			description: 'test',
			userId: userId,
			pinned: false
		});

		const update = {
			title: 'test2',
			description: 'test2',
			pinned: true
		};

		const { projectId } = await Project.find({ title: project.title });
		const response = await request(app)
			.put(`/api/projects/${userId}/${projectId}`)
			.send(update)
			.expect(401);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthenticated
		);

		const updatedProject = await Project.find({ user_id: userId });

		expect(updatedProject.title).toEqual(project.title);
		expect(updatedProject.description).toEqual(project.description);
		expect(updatedProject.pinned).toEqual(project.pinned);
	});

	it('throws error if not authorized', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');

		const { token: token2 } = await createTestUser(
			'test2@gmail.com',
			'111111'
		);

		const project = await createTestProject({
			title: 'test',
			description: 'test',
			userId: userId,
			pinned: false
		});

		const update = {
			title: 'test2',
			description: 'test2',
			pinned: true
		};

		const { projectId } = await Project.find({ title: project.title });
		const response = await request(app)
			.put(`/api/projects/${userId}/${projectId}`)
			.set('Authorization', `Bearer ${token2}`)
			.send(update)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);

		const updatedProject = await Project.find({ user_id: userId });

		expect(updatedProject.title).toEqual(project.title);
		expect(updatedProject.description).toEqual(project.description);
		expect(updatedProject.pinned).toEqual(project.pinned);
	});
});
