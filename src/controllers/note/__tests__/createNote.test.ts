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
		const { user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNoteBody(user_id);

		const response = await request(app)
			.post(`/api/notes/${user_id}`)
			.set('Authorization', `Bearer ${token}`)
			.send(note)
			.expect(201);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(createMessage.success.note);
	});

	it('throws error if no title', async () => {
		const { user_id } = await createTestUser('test@gmail.com', '111111');

		const note = await testNoteBody(user_id);
		note.title = '';

		const response = await request(app)
			.post(`/api/notes/${user_id}`)
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
		const { user_id } = await createTestUser('test@gmail.com', '111111');

		const note = await testNoteBody(user_id);
		note.description = '';

		const response = await request(app)
			.post(`/api/notes/${user_id}`)
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
		const { user_id } = await createTestUser('test@gmail.com', '111111');

		const note = await testNoteBody(user_id);
		// @ts-ignore
		note.taskId = null;

		const response = await request(app)
			.post(`/api/notes/${user_id}`)
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
		const { user_id } = await createTestUser('test@gmail.com', '111111');

		const note = await testNoteBody(user_id);
		//@ts-ignore
		note.projectId = null;

		const response = await request(app)
			.post(`/api/notes/${user_id}`)
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
		const { user_id } = await createTestUser('test@gmail.com', '111111');

		const note = await testNoteBody(user_id);
		//@ts-ignore
		note.startTime = '';

		const response = await request(app)
			.post(`/api/notes/${user_id}`)
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
		const { user_id } = await createTestUser('test@gmail.com', '111111');

		const note = await testNoteBody(user_id);
		//@ts-ignore
		note.endTime = '';

		const response = await request(app)
			.post(`/api/notes/${user_id}`)
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
		const { user_id } = await createTestUser('test@gmail.com', '111111');

		const note = await testNoteBody(user_id);

		const response = await request(app)
			.post(`/api/notes/${user_id}`)
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
		const { user_id } = await createTestUser('test@gmail.com', '111111');

		const { token: token2 } = await createTestUser(
			'test2@gmail.com',
			'111111'
		);

		const note = await testNoteBody(user_id);

		const response = await request(app)
			.post(`/api/notes/${user_id}`)
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
