import request from 'supertest';
import { app } from '../../../app';
import {
	genericMessage,
	taskMessage
} from '../../../responses/responseStrings';
import {
	createTestTask,
	createTestUser,
	testTaskBody
} from '../../../test/setup';

describe('Get All Tasks Controller', () => {
	it('gets all tasks db', async () => {
		const { public_user_id, user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const taskBody1 = await testTaskBody(user_id);
		const taskBody2 = await testTaskBody(user_id);

		//@ts-ignore
		await createTestTask({ ...taskBody1 });
		//@ts-ignore
		await createTestTask({ ...taskBody2 });

		const response = await request(app)
			.get(`/api/tasks/${public_user_id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(taskMessage.success.getTask);
		expect(response.body.data[0].title).toEqual(taskBody1.title);
		expect(response.body.data[1].title).toEqual(taskBody2.title);
	});

	it('throws error if tasks do not exist', async () => {
		const { public_user_id, user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const response = await request(app)
			.get(`/api/tasks/${public_user_id}`)
			.set('Authorization', token)
			.expect(404);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notFound
		);
	});

	it('throws error if not logged in', async () => {
		const { public_user_id } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const response = await request(app)
			.get(`/api/tasks/${public_user_id}`)
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

		const response = await request(app)
			.get(`/api/tasks/${public_user_id}`)
			.set('Authorization', `Bearer ${token2}`)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);
	});
});
