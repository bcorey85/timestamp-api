import request from 'supertest';
import { app } from '../../../app';
import { createTestUser } from '../../../test/setup';
import { User } from '../../../models/User';
import {
	userMessage,
	requestValidationMessage,
	genericMessage
} from '../../../responses/responseStrings';

describe('Delete User Controller', () => {
	it('deletes user from db', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const response = await request(app)
			.delete(`/api/users/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toBe(userMessage.success.deleteUser);
		expect(response.body.data).toStrictEqual({});

		const user = await User.find({ user_id: userId });

		expect(user).toBe(undefined);
	});

	it('throws error if invalid user id provided', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const response = await request(app)
			.delete(`/api/users/invalid`)
			.set('Authorization', `Bearer ${token}`)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			requestValidationMessage.error.userId
		);
		expect(response.body.data).toBe(undefined);

		const user = await User.find({ user_id: userId });

		expect(user.userId).toEqual(userId);
	});

	it('throws error if no user found', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const fakeId = 500;

		const response = await request(app)
			.delete(`/api/users/${fakeId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);
		expect(response.body.data).toBe(undefined);

		const user = await User.find({ user_id: userId });

		expect(user.userId).toEqual(userId);
	});
});
