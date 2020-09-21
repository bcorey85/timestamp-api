import request from 'supertest';
import { app } from '../../../app';
import {
	createMessage,
	genericMessage,
	projectMessage
} from '../../../responses/responseStrings';
import { Project } from '../../../models/Project';
import { createTestProject, createTestUser } from '../../../test/setup';

describe('Get All Projects Controller', () => {
	it('gets all project from db', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const project1 = await createTestProject({
			title: 'test',
			description: 'test',
			userId: userId,
			pinned: false
		});

		const project2 = await createTestProject({
			title: 'test2',
			description: 'test2',
			userId: userId,
			pinned: false
		});

		const response = await request(app)
			.get(`/api/projects/${userId}/`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(
			projectMessage.success.getProject
		);
		expect(response.body.data.length).toBe(2);
		expect(response.body.data[0].title).toEqual(project1.title);
		expect(response.body.data[1].title).toEqual(project2.title);
	});

	it('throws error if not found', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const response = await request(app)
			.get(`/api/projects/${userId}/`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notFound
		);
	});

	it('throws error if not logged in', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');

		const response = await request(app)
			.get(`/api/projects/${userId}/`)
			.expect(401);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthenticated
		);
	});

	it('throws error if not authorized', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const { token: token2 } = await createTestUser(
			'test2@gmail.com',
			'111111'
		);

		const project = {
			title: 'test title',
			description: 'test description'
		};

		const createdResponse = await request(app)
			.post(`/api/projects/${userId}/`)
			.set('Authorization', `Bearer ${token}`)
			.send(project)
			.expect(201);

		const { projectId } = await Project.find({ title: project.title });

		const getResponse = await request(app)
			.get(`/api/projects/${userId}/${projectId}`)
			.set('Authorization', `Bearer ${token2}`)
			.send(project)
			.expect(403);

		expect(getResponse.body.success).toBe(false);
		expect(getResponse.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);
	});
});
