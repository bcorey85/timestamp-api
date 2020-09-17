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
	it('updates task in db', async () => {
		const { user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const taskBody = await testTaskBody(user_id);

		const { task_id, project_id } = await createTestTask({ ...taskBody });

		const update = {
			title: 'test2',
			description: 'test2',
			projectId: project_id,
			tags: [ '#1', '#2' ],
			pinned: true
		};

		const response = await request(app)
			.put(`/api/tasks/${user_id}/${task_id}`)
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
		const { user_id, token } = await createTestUser(
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
			.put(`/api/tasks/${user_id}/${fakeId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(update)
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
		const { user_id } = await createTestUser('test@gmail.com', '111111');

		const taskBody = await testTaskBody(user_id);

		const { task_id, project_id } = await createTestTask({ ...taskBody });

		const update = {
			title: 'test2',
			description: 'test2',
			projectId: project_id,
			tags: [ '#1', '#2' ],
			pinned: true
		};

		const response = await request(app)
			.put(`/api/tasks/${user_id}/${task_id}`)
			.send(update)
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

		const { task_id, project_id } = await createTestTask({ ...taskBody });

		const update = {
			title: 'test2',
			description: 'test2',
			projectId: project_id,
			tags: [ '#1', '#2' ],
			pinned: true
		};

		const response = await request(app)
			.put(`/api/tasks/${user_id}/${task_id}`)
			.set('Authorization', `Bearer ${token2}`)
			.send(update)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);
	});
});
