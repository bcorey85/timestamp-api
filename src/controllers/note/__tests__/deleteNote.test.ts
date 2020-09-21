import request from 'supertest';
import { app } from '../../../app';
import {
	genericMessage,
	noteMessage
} from '../../../responses/responseStrings';
import { Note } from '../../../models/Note';
import {
	createTestUser,
	createTestNote,
	testNoteBody
} from '../../../test/setup';

describe('Delete Note Controller', () => {
	it('deletes note from db', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const noteBody = await testNoteBody(userId);

		const { noteId } = await createTestNote({ ...noteBody });

		const response = await request(app)
			.delete(`/api/notes/${userId}/${noteId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(noteMessage.success.deleteNote);

		const noteTest = await Note.find({ title: noteBody.title });
		expect(noteTest).toBe(undefined);
	});

	it('throws error if note not found', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const noteBody = await testNoteBody(userId);

		const note = await createTestNote({ ...noteBody });

		const fakeId = 500;
		const response = await request(app)
			.delete(`/api/notes/${userId}/${fakeId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notFound
		);

		const noteTest = await Note.find({ title: note.title });

		expect(noteTest.title).toBe(noteBody.title);
	});

	it('throws error if not logged in', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const noteBody = await testNoteBody(userId);

		const note = await createTestNote({ ...noteBody });

		const response = await request(app)
			.delete(`/api/notes/${userId}/${note.noteId}`)
			.expect(401);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthenticated
		);

		const noteTest = await Note.find({ title: note.title });

		expect(noteTest.title).toBe(noteBody.title);
	});

	it('throws error if not authorized', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');

		const { token: token2 } = await createTestUser(
			'test2@gmail.com',
			'111111'
		);

		const noteBody = await testNoteBody(userId);

		const note = await createTestNote({ ...noteBody });

		const response = await request(app)
			.delete(`/api/notes/${userId}/${note.noteId}`)
			.set('Authorization', token2)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);

		const noteTest = await Note.find({ title: note.title });

		expect(noteTest.title).toBe(noteBody.title);
	});
});
