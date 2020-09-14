import request from 'supertest';
import { app } from '../../../app';
import { Task } from '../../../models/Task';
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
	it('gets single task from  db', async () => {
		const { public_user_id, user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const taskBody = await testTaskBody(user_id);

		//@ts-ignore
		const { task_id } = await createTestTask({ ...taskBody });

		const update = {
			title: 'test2',
			description: 'test2',
			tags: [ '#1', '#2' ],
			pinned: true
		};

		const response = await request(app)
			.put(`/api/tasks/${public_user_id}/${task_id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(update)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(taskMessage.success.updateTask);

		const taskTest = await Task.find({ task_id });
		expect(taskTest.title).toEqual(update.title);
		expect(taskTest.description).toEqual(update.description);
		expect(taskTest.pinned).toEqual(update.pinned);
	});

	it('throws error if task does not exist', async () => {
		const { public_user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const fakeId = 500;
		const response = await request(app)
			.put(`/api/tasks/${public_user_id}/${fakeId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notFound
		);
	});

	it.todo('throws error if no title');
	it.todo('throws error if no description');
	it.todo('throws error if no projectId');

	it('throws error if not logged in', async () => {
		const { public_user_id, user_id } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const taskBody = await testTaskBody(user_id);

		//@ts-ignore
		const { task_id } = await createTestTask({ ...taskBody });

		const response = await request(app)
			.put(`/api/tasks/${public_user_id}/${task_id}`)
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

		const taskBody = await testTaskBody(user_id);

		//@ts-ignore
		const { task_id } = await createTestTask({ ...taskBody });

		const response = await request(app)
			.put(`/api/tasks/${public_user_id}/${task_id}`)
			.set('Authorization', `Bearer ${token2}`)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);
	});
});
