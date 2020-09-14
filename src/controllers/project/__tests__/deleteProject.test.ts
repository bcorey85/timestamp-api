import request from 'supertest';
import { app } from '../../../app';
import {
	projectMessage,
	genericMessage
} from '../../../responses/responseStrings';
import { Project } from '../../../models/Project';
import { createTestUser, createTestProject } from '../../../test/setup';

describe('Delete Project Controller', () => {
	it('deletes from db', async () => {
		const { user_id, public_user_id, token } = await createTestUser(
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

		const deleteResponse = await request(app)
			.delete(`/api/projects/${public_user_id}/${project_id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(deleteResponse.body.success).toBe(true);
		expect(deleteResponse.body.message).toEqual(
			projectMessage.success.deleteProject
		);
	});

	it('throws error if not found', async () => {
		const { user_id, public_user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const project = await createTestProject({
			title: 'test',
			description: 'test',
			userId: user_id,
			pinned: false
		});

		const deleteResponse = await request(app)
			.delete(`/api/projects/${public_user_id}/500`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404);

		expect(deleteResponse.body.success).toBe(false);
		expect(deleteResponse.body.errors[0].message).toEqual(
			genericMessage.error.notFound
		);
	});

	it('throws error if not logged in', async () => {
		const { user_id, public_user_id } = await createTestUser(
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

		const deleteResponse = await request(app)
			.delete(`/api/projects/${public_user_id}/${project_id}`)
			.expect(401);

		expect(deleteResponse.body.success).toBe(false);
		expect(deleteResponse.body.errors[0].message).toEqual(
			genericMessage.error.notAuthenticated
		);
	});

	it('throws error if not authorized', async () => {
		const { user_id, public_user_id } = await createTestUser(
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

		const deleteResponse = await request(app)
			.delete(`/api/projects/${public_user_id}/${project_id}`)
			.set('Authorization', `Bearer ${token2}`)
			.expect(403);

		expect(deleteResponse.body.success).toBe(false);
		expect(deleteResponse.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);
	});
});
