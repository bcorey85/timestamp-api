import request from 'supertest';
import { app } from '../../../app';
import {
	authMessage,
	requestValidationMessage,
	createMessage
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

		expect(true).toBe(true);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(createMessage.success.project);
	});
});
