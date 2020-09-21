import request from 'supertest';
import { app } from '../../../app';
import {
	createMessage,
	genericMessage
} from '../../../responses/responseStrings';
import { Note } from '../../../models/Note';
import { createTestUser, testNoteBody } from '../../../test/setup';

describe('Create Note Controller', () => {
	it('creates new note in db', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNoteBody(userId);

		const response = await request(app)
			.post(`/api/notes/${userId}`)
			.set('Authorization', `Bearer ${token}`)
			.send(note)
			.expect(201);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(createMessage.success.note);
	});

	it('throws error if no title', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNoteBody(userId);
		note.title = '';

		const response = await request(app)
			.post(`/api/notes/${userId}`)
			.set('Authorization', token)
			.send(note)
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			createMessage.error.title
		);

		const noteTest = await Note.find({ title: note.title });
		expect(noteTest).toBe(undefined);
	});

	it('throws error if no taskId', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNoteBody(userId);
		// @ts-ignore
		note.taskId = null;

		const response = await request(app)
			.post(`/api/notes/${userId}`)
			.set('Authorization', `Bearer ${token}`)
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
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNoteBody(userId);
		//@ts-ignore
		note.projectId = null;

		const response = await request(app)
			.post(`/api/notes/${userId}`)
			.set('Authorization', `Bearer ${token}`)
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
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNoteBody(userId);
		//@ts-ignore
		note.startTime = '';

		const response = await request(app)
			.post(`/api/notes/${userId}`)
			.set('Authorization', `Bearer ${token}`)
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
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNoteBody(userId);
		//@ts-ignore
		note.endTime = '';

		const response = await request(app)
			.post(`/api/notes/${userId}`)
			.set('Authorization', `Bearer ${token}`)
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
		const { userId } = await createTestUser('test@gmail.com', '111111');

		const note = await testNoteBody(userId);

		const response = await request(app)
			.post(`/api/notes/${userId}`)
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
		const { userId } = await createTestUser('test@gmail.com', '111111');

		const { token: token2 } = await createTestUser(
			'test2@gmail.com',
			'111111'
		);

		const note = await testNoteBody(userId);

		const response = await request(app)
			.post(`/api/notes/${userId}`)
			.set('Authorization', `Bearer ${token2}`)
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
