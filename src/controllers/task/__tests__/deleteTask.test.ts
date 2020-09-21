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
import { Task } from '../../../models/Task';

describe('Delete Task Controller', () => {
	it('delete task from db', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const taskBody = await testTaskBody(userId);

		const { taskId } = await createTestTask({ ...taskBody });

		const response = await request(app)
			.delete(`/api/tasks/${userId}/${taskId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(taskMessage.success.deleteTask);

		const taskTest = await Task.find({ title: taskBody.title });
		expect(taskTest).toBe(undefined);
	});

	it('throws error if task does not exist', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const taskBody = await testTaskBody(userId);

		await createTestTask({ ...taskBody });

		const fakeId = 500;
		const response = await request(app)
			.delete(`/api/tasks/${userId}/${fakeId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notFound
		);

		const taskTest = await Task.find({ title: taskBody.title });
		expect(taskTest.title).toBe(taskBody.title);
	});

	it('throws error if not logged in', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');

		const taskBody = await testTaskBody(userId);

		const { taskId } = await createTestTask({ ...taskBody });

		const response = await request(app)
			.delete(`/api/tasks/${userId}/${taskId}`)
			.expect(401);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthenticated
		);

		const taskTest = await Task.find({ title: taskBody.title });
		expect(taskTest.title).toBe(taskBody.title);
	});

	it('throws error if not authorized', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const { token: token2 } = await createTestUser(
			'test2@gmail.com',
			'111111'
		);

		const taskBody = await testTaskBody(userId);

		const { taskId } = await createTestTask({ ...taskBody });

		const response = await request(app)
			.delete(`/api/tasks/${userId}/${taskId}`)
			.set('Authorization', `Bearer ${token2}`)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);

		const taskTest = await Task.find({ title: taskBody.title });
		expect(taskTest.title).toBe(taskBody.title);
	});
});
