import request from 'supertest';
import { app } from '../../../app';
import {
	createMessage,
	genericMessage,
	noteMessage,
	requestValidationMessage
} from '../../../responses/responseStrings';
import { NewNote, Note } from '../../../models/Note';
import {
	createTestProject,
	createTestTask,
	createTestUser
} from '../../../test/setup';

const makeParentItems = async (user_id: string) => {
	const { project_id } = await createTestProject({
		title: 'test',
		description: 'test',
		userId: user_id,
		pinned: false
	});

	const { task_id } = await createTestTask({
		title: 'test',
		description: 'test',
		userId: user_id,
		projectId: project_id.toString(),
		pinned: false,
		tags: [ '#tag1', '#tag2' ]
	});

	return { project_id, task_id };
};

const testNote = async (userId: string) => {
	const { project_id, task_id } = await makeParentItems(userId as string);
	return {
		title: 'test',
		description: 'test',
		projectId: project_id,
		taskId: task_id,
		userId: userId,
		pinned: false,
		hours: 1,
		startTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
		endTime: new Date(Date.now()).toISOString(),
		tags: [ '#tag1', '#tag2' ]
	};
};

describe('Create Note Controller', () => {
	it('creates new note in db', async () => {
		const { public_user_id, user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNote(user_id);

		const response = await request(app)
			.post(`/api/notes/${public_user_id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(note)
			.expect(201);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(createMessage.success.note);
	});

	it('throws error if no title', async () => {
		const { public_user_id, user_id } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNote(user_id);
		note.title = '';

		const response = await request(app)
			.post(`/api/notes/${public_user_id}`)
			.send(note)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			createMessage.error.title
		);

		const noteTest = await Note.find({ title: note.title });
		expect(noteTest).toBe(undefined);
	});

	it('throws error if no description', async () => {
		const { public_user_id, user_id } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNote(user_id);
		note.description = '';

		const response = await request(app)
			.post(`/api/notes/${public_user_id}`)
			.send(note)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			createMessage.error.description
		);

		const noteTest = await Note.find({ title: note.title });
		expect(noteTest).toBe(undefined);
	});

	it('throws error if no taskId', async () => {
		const { public_user_id, user_id } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNote(user_id);
		// @ts-ignore
		note.taskId = null;

		const response = await request(app)
			.post(`/api/notes/${public_user_id}`)
			.send(note)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			createMessage.error.task
		);

		const noteTest = await Note.find({ title: note.title });
		expect(noteTest).toBe(undefined);
	});

	it('throws error if no projectId', async () => {
		const { public_user_id, user_id } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNote(user_id);
		//@ts-ignore
		note.projectId = null;

		const response = await request(app)
			.post(`/api/notes/${public_user_id}`)
			.send(note)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			createMessage.error.project
		);

		const noteTest = await Note.find({ title: note.title });
		expect(noteTest).toBe(undefined);
	});

	it('throws error if no startTime', async () => {
		const { public_user_id, user_id } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNote(user_id);
		note.startTime = '';

		const response = await request(app)
			.post(`/api/notes/${public_user_id}`)
			.send(note)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			createMessage.error.start
		);

		const noteTest = await Note.find({ title: note.title });
		expect(noteTest).toBe(undefined);
	});

	it('throws error if no endTime', async () => {
		const { public_user_id, user_id } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNote(user_id);
		note.endTime = '';

		const response = await request(app)
			.post(`/api/notes/${public_user_id}`)
			.send(note)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			createMessage.error.end
		);

		const noteTest = await Note.find({ title: note.title });
		expect(noteTest).toBe(undefined);
	});

	it('throws error if not logged in', async () => {
		const { public_user_id, user_id } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNote(user_id);

		const response = await request(app)
			.post(`/api/notes/${public_user_id}`)
			.send(note)
			.expect(401);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthenticated
		);

		const noteTest = await Note.find({ title: note.title });
		expect(noteTest).toBe(undefined);
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

		const note = await testNote(user_id);

		const response = await request(app)
			.post(`/api/notes/${public_user_id}`)
			.set('Authorization', token2)
			.send(note)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);

		const noteTest = await Note.find({ title: note.title });
		expect(noteTest).toBe(undefined);
	});
});
