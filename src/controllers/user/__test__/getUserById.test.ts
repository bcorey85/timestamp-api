import request from 'supertest';
import { app } from '../../../app';
import { createTestUser } from '../../../test/setup';
import {
	userMessage,
	requestValidationMessage,
	genericMessage
} from '../../../responses/responseStrings';

describe('Get User By Id Controller', () => {
	it('returns user object if request successful', async () => {
		const { user_id, token } = await createTestUser(
			'test@gmail.com',
			'123456'
		);

		const response = await request(app)
			.get(`/api/users/${user_id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(userMessage.success.getUser);
		expect(response.body.data).toHaveProperty('user');
		expect(response.body.data.user.user_id).toEqual(user_id);
		expect(response.body.data.user).not.toHaveProperty('password');
		expect(response.body.data.user).not.toHaveProperty(
			'password_reset_link'
		);
		expect(response.body.data.user).not.toHaveProperty(
			'password_reset_expires'
		);
	});

	it('throws error if invalid user id provided', async () => {
		const { token } = await createTestUser('test@gmail.com', '111111');

		const response = await request(app)
			.get(`/api/users/111`)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			requestValidationMessage.error.userId
		);
		expect(response.body.data).toBe(undefined);
	});

	it('throws error if no user found', async () => {
		const { token } = await createTestUser('test@gmail.com', '111111');

		const fakeId = 'a2c3c87e-822a-41d4-a48b-0934cdfdf19d';

		const response = await request(app)
			.get(`/api/users/${fakeId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);
		expect(response.body.data).toBe(undefined);
	});
});
