import request from 'supertest';
import { app } from '../../../app';
import {
	createMessage,
	genericMessage
} from '../../../responses/responseStrings';
import { Project } from '../../../models/Project';
import { createTestUser } from '../../../test/setup';

describe('Create Project Controller', () => {
	it('creates new project in db', async () => {
		const { public_user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const project = {
			title: 'test title',
			description: 'test description'
		};

		const response = await request(app)
			.post(`/api/projects/${public_user_id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(project)
			.expect(201);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(createMessage.success.project);
	});

	it('throws error if no title', async () => {
		const { user_id, public_user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const project = {
			title: '',
			description: 'test description'
		};

		const response = await request(app)
			.post(`/api/projects/${public_user_id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(project)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			createMessage.error.title
		);

		const userProjects = await Project.findAll(user_id);
		expect(userProjects.length).toBe(0);
	});

	it('throws error if no description', async () => {
		const { user_id, public_user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const project = {
			title: 'test title',
			description: ''
		};

		const response = await request(app)
			.post(`/api/projects/${public_user_id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(project)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			createMessage.error.description
		);

		const userProjects = await Project.findAll(user_id);
		expect(userProjects.length).toBe(0);
	});

	it('throws error if not logged in', async () => {
		const { public_user_id } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const project = {
			title: 'test title',
			description: 'test description'
		};

		const response = await request(app)
			.post(`/api/projects/${public_user_id}`)
			.send(project)
			.expect(401);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthenticated
		);
	});

	it('throws error if not authorized', async () => {
		const { public_user_id } = await createTestUser(
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

		const response = await request(app)
			.post(`/api/projects/${public_user_id}`)
			.set('Authorization', `Bearer ${token2}`)
			.send(project)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);
	});
});
