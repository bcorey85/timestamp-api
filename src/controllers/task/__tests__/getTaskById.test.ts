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

describe('Get Task By Id Controller', () => {
	it('gets single task from db', async () => {
		const { user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const taskBody = await testTaskBody(user_id);

		const { task_id } = await createTestTask({ ...taskBody });

		const response = await request(app)
			.get(`/api/tasks/${user_id}/${task_id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(taskMessage.success.getTask);
		expect(response.body.data.title).toEqual(taskBody.title);
	});

	it('throws error if task does not exist', async () => {
		const { user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const fakeId = 500;
		const response = await request(app)
			.get(`/api/tasks/${user_id}/${fakeId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notFound
		);
	});

	it('throws error if not logged in', async () => {
		const { user_id } = await createTestUser('test@gmail.com', '111111');

		const taskBody = await testTaskBody(user_id);

		const { task_id } = await createTestTask({ ...taskBody });

		const response = await request(app)
			.get(`/api/tasks/${user_id}/${task_id}`)
			.expect(401);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthenticated
		);
	});

	it('throws error if not authorized', async () => {
		const { user_id } = await createTestUser('test@gmail.com', '111111');
		const { token: token2 } = await createTestUser(
			'test2@gmail.com',
			'111111'
		);

		const taskBody = await testTaskBody(user_id);

		//@ts-ignore
		const { task_id } = await createTestTask({ ...taskBody });

		const response = await request(app)
			.get(`/api/tasks/${user_id}/${task_id}`)
			.set('Authorization', `Bearer ${token2}`)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);
	});
});
