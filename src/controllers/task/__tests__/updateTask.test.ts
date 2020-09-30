import request from 'supertest';
import { app } from '../../../app';
import { Task } from '../../../models/Task';
import {
	createMessage,
	genericMessage,
	taskMessage
} from '../../../responses/responseStrings';
import {
	createTestTask,
	createTestUser,
	testTaskBody
} from '../../../test/setup';

describe('Get Task By Id Controller', () => {
	it('updates task in db', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const taskBody = await testTaskBody(userId);

		const { taskId, projectId } = await createTestTask({ ...taskBody });

		const update = {
			title: 'test2',
			description: 'test2',
			projectId: projectId,
			tags: [ '#1', '#2' ],
			pinned: true
		};

		const response = await request(app)
			.put(`/api/tasks/${userId}/${taskId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(update)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(taskMessage.success.updateTask);

		const taskTest = await Task.find({ task_id: taskId });
		expect(taskTest.title).toEqual(update.title);
		expect(taskTest.description).toEqual(update.description);
		expect(taskTest.pinned).toEqual(update.pinned);
	});

	it('throws error if task does not exist', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const update = {
			title: 'test2',
			description: 'test2',
			projectId: 500,
			tags: [ '#1', '#2' ],
			pinned: true
		};

		const fakeId = 500;
		const response = await request(app)
			.put(`/api/tasks/${userId}/${fakeId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(update)
			.expect(404);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notFound
		);

		const taskTest = await Task.findAll({ user_id: userId });
		expect(taskTest.length).toEqual(0);
	});

	it('throws error if no title', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const taskBody = await testTaskBody(userId);

		const { taskId } = await createTestTask({ ...taskBody });

		const update = {
			title: '',
			description: 'test2',
			projectId: 500,
			tags: [ '#1', '#2' ],
			pinned: true
		};

		const response = await request(app)
			.put(`/api/tasks/${userId}/${taskId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(update)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			createMessage.error.title
		);

		const taskTest = await Task.find({ task_id: taskId });
		expect(taskTest.title).not.toEqual(update.title);
	});

	it('throws error if no projectId', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const taskBody = await testTaskBody(userId);

		const { taskId } = await createTestTask({ ...taskBody });

		const update = {
			title: 'test2',
			description: 'test2',
			projectId: null,
			tags: [ '#1', '#2' ],
			pinned: true
		};

		const response = await request(app)
			.put(`/api/tasks/${userId}/${taskId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(update)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			createMessage.error.project
		);

		const taskTest = await Task.find({ task_id: taskId });
		expect(taskTest.projectId).not.toEqual(update.projectId);
	});

	it('throws error if not logged in', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');

		const taskBody = await testTaskBody(userId);

		const { taskId, projectId } = await createTestTask({ ...taskBody });

		const update = {
			title: 'test2',
			description: 'test2',
			projectId: projectId,
			tags: [ '#1', '#2' ],
			pinned: true
		};

		const response = await request(app)
			.put(`/api/tasks/${userId}/${taskId}`)
			.send(update)
			.expect(401);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthenticated
		);
	});

	it('throws error if not authorized', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');
		const { token: token2 } = await createTestUser(
			'test2@gmail.com',
			'111111'
		);

		const taskBody = await testTaskBody(userId);

		const { taskId, projectId } = await createTestTask({ ...taskBody });

		const update = {
			title: 'test2',
			description: 'test2',
			projectId: projectId,
			tags: [ '#1', '#2' ],
			pinned: true
		};

		const response = await request(app)
			.put(`/api/tasks/${userId}/${taskId}`)
			.set('Authorization', `Bearer ${token2}`)
			.send(update)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);
	});
});
