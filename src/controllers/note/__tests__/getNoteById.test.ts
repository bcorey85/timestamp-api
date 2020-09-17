import request from 'supertest';
import { app } from '../../../app';
import {
	genericMessage,
	noteMessage
} from '../../../responses/responseStrings';
import {
	createTestUser,
	createTestNote,
	testNoteBody
} from '../../../test/setup';

describe('Get Note by Id Controller', () => {
	it('get single note from db', async () => {
		const { user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNoteBody(user_id);

		const { note_id, title } = await createTestNote({ ...note });

		const response = await request(app)
			.get(`/api/notes/${user_id}/${note_id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(noteMessage.success.getNote);
		expect(response.body.data.title).toEqual(title);
	});

	it('throws error if not found', async () => {
		const { user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const fakeId = 500;
		const response = await request(app)
			.get(`/api/notes/${user_id}/${fakeId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toBe(
			genericMessage.error.notFound
		);
	});

	it('throws error if not logged in', async () => {
		const { user_id } = await createTestUser('test@gmail.com', '111111');

		const note = await testNoteBody(user_id);

		const { note_id } = await createTestNote({ ...note });
		const response = await request(app)
			.get(`/api/notes/${user_id}/${note_id}`)
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

		const note = await testNoteBody(user_id);

		const { note_id } = await createTestNote({ ...note });

		const response = await request(app)
			.get(`/api/notes/${user_id}/${note_id}`)
			.set('Authorization', token2)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);
	});
});
