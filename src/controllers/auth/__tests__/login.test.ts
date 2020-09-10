import request from 'supertest';
import { app } from '../../../app';
import {
	authMessage,
	requestValidationMessage
} from '../../../responses/responseStrings';
import { User } from '../../../models/User';
import { createTestUser } from '../../../test/setup';

describe('Login Controller', () => {
	it('returns token if successful login', async () => {
		const existingUser = await createTestUser('test2@gmail.com', '123456');

		const user = {
			email: 'test2@gmail.com',
			password: '123456'
		};

		const response = await request(app)
			.post('/api/auth/login')
			.send(user)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(authMessage.success.loginValid);
		expect(response.body.data).toHaveProperty('token');
		expect(response.body.data.token).not.toBe(null);
	});

	it('throws error if invalid email', async () => {
		const user = {
			email: 'test',
			password: '123456'
		};
		const response = await request(app)
			.post('/api/auth/login')
			.send(user)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			requestValidationMessage.error.email
		);
		expect(response.body).not.toHaveProperty('data');
	});

	it('throws error if invalid password', async () => {
		const user = {
			email: 'test@gmail.com',
			password: '123'
		};
		const response = await request(app)
			.post('/api/auth/login')
			.send(user)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			requestValidationMessage.error.password
		);
		expect(response.body).not.toHaveProperty('data');
	});
});
