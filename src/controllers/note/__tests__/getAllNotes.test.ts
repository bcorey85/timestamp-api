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

describe('Get All Notes Controller', () => {
	it('get all notes from db', async () => {
		const { user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNoteBody(user_id);
		const note2 = await testNoteBody(user_id);

		await createTestNote({ ...note });
		await createTestNote({ ...note2 });

		const response = await request(app)
			.get(`/api/notes/${user_id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(noteMessage.success.getNote);
	});

	it('throws error if not found', async () => {
		const { user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const response = await request(app)
			.get(`/api/notes/${user_id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toBe(
			genericMessage.error.notFound
		);
	});

	it('throws error if not logged in', async () => {
		const { user_id } = await createTestUser('test@gmail.com', '111111');

		const response = await request(app)
			.get(`/api/notes/${user_id}`)
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

		const response = await request(app)
			.get(`/api/notes/${user_id}`)
			.set('Authorization', token2)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);
	});
});
