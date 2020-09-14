import request from 'supertest';
import { app } from '../../../app';
import {
	genericMessage,
	projectMessage
} from '../../../responses/responseStrings';
import { Project } from '../../../models/Project';
import { createTestUser, createTestProject } from '../../../test/setup';

describe('Get Project Controller', () => {
	it('gets single project from db', async () => {
		const { public_user_id, user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const project = await createTestProject({
			title: 'test',
			description: 'test',
			userId: user_id,
			pinned: false
		});

		const { project_id } = await Project.find({ title: project.title });

		const response = await request(app)
			.get(`/api/projects/${public_user_id}/${project_id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(project)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(
			projectMessage.success.getProject
		);
	});

	it('throws error if not found', async () => {
		const { public_user_id, user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const project = await createTestProject({
			title: 'test',
			description: 'test',
			userId: user_id,
			pinned: false
		});

		const response = await request(app)
			.get(`/api/projects/${public_user_id}/500`)
			.set('Authorization', `Bearer ${token}`)
			.send(project)
			.expect(404);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notFound
		);
	});

	it('throws error if not logged in', async () => {
		const { public_user_id, user_id } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const project = await createTestProject({
			title: 'test',
			description: 'test',
			userId: user_id,
			pinned: false
		});

		const { project_id } = await Project.find({ title: project.title });

		const response = await request(app)
			.get(`/api/projects/${public_user_id}/${project_id}`)
			.send(project)
			.expect(401);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthenticated
		);
	});

	it('throws error if not authorized', async () => {
		const { public_user_id, user_id } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const { token: token2 } = await createTestUser(
			'test2@gmail.com',
			'111111'
		);

		const project = await createTestProject({
			title: 'test',
			description: 'test',
			userId: user_id,
			pinned: false
		});

		const { project_id } = await Project.find({ title: project.title });

		const response = await request(app)
			.get(`/api/projects/${public_user_id}/${project_id}`)
			.set('Authorization', `Bearer ${token2}`)
			.send(project)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);
	});
});
