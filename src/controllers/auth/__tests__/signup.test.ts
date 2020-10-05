import request from 'supertest';
import { app } from '../../../app';
import {
	authMessage,
	requestValidationMessage
} from '../../../responses/responseStrings';
import { User } from '../../../models/User';

describe('Signup Controller', () => {
	it('creates new user in database and sends success object', async () => {
		const user = {
			email: 'test@gmail.com',
			password: '123456',
			passwordConfirm: '123456'
		};
		const response = await request(app)
			.post('/api/auth/signup')
			.send(user)
			.expect(201);

		expect(true).toBe(true);
		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(
			authMessage.success.registerSuccess
		);
		expect(response.body.data).toHaveProperty('token');
		expect(response.body.data.token).not.toBe(null);
	});

	it('throws error if existing user', async () => {
		const existingUser = await User.create('test@gmail.com', '123456');

		const user = {
			email: 'test@gmail.com',
			password: '123456',
			passwordConfirm: '123456'
		};

		const response = await request(app)
			.post('/api/auth/signup')
			.send(user)
			.expect(400);

		expect(response.body.success).toEqual(false);
		expect(response.body.errors[0].message).toEqual(
			authMessage.error.emailInUse
		);

		const users = await User.findAll();
		expect(users.length).toEqual(1);
	});

	it('throws error if invalid email', async () => {
		const user = {
			email: 'test',
			password: '123456',
			passwordConfirm: '123456'
		};
		const response = await request(app)
			.post('/api/auth/signup')
			.send(user)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			requestValidationMessage.error.email
		);
		expect(response.body).not.toHaveProperty('data');

		const users = await User.findAll();
		expect(users.length).toEqual(0);
	});

	it('throws error if invalid password', async () => {
		const user = {
			email: 'test@gmail.com',
			password: '123',
			passwordConfirm: '123456'
		};
		const response = await request(app)
			.post('/api/auth/signup')
			.send(user)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			requestValidationMessage.error.password
		);
		expect(response.body).not.toHaveProperty('data');

		const users = await User.findAll();
		expect(users.length).toEqual(0);
	});

	it('throws error if passwords dont match', async () => {
		const user = {
			email: 'test@gmail.com',
			password: '123456',
			passwordConfirm: '123455'
		};
		const response = await request(app)
			.post('/api/auth/signup')
			.send(user)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			authMessage.error.passwordConfirm
		);
		expect(response.body).not.toHaveProperty('data');

		const users = await User.findAll();
		expect(users.length).toEqual(0);
	});
});
