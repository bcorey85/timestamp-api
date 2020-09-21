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

describe('Update Note Controller', () => {
	it('update note in db', async () => {
		const { userId, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const note = await testNoteBody(userId);

		const { noteId, taskId, projectId } = await createTestNote({
			...note
		});

		const update = {
			title: 'test2',
			description: 'test2',
			tags: [ '#tag1', '#tag2' ],
			startTime: new Date(Date.now() - 1000 * 60 * 60),
			endTime: new Date(Date.now()),
			taskId: taskId,
			projectId: projectId,
			hours: 1,
			pinned: false
		};

		const response = await request(app)
			.put(`/api/notes/${userId}/${noteId}`)
			.set('Authorization', token)
			.send(update)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(noteMessage.success.updateNote);

		const noteTest = await Note.find({ note_id: noteId });
		expect(noteTest.title).toEqual(update.title);
		expect(noteTest.description).toEqual(update.description);
	});

	it.todo('throws error if no title');
	it.todo('throws error if no taskId');
	it.todo('throws error if no projectId');
	it.todo('throws error if no startTime');
	it.todo('throws error if no endTime');

	it('throws error if not logged in', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');

		const note = await testNoteBody(userId);

		const { noteId, taskId, projectId } = await createTestNote({
			...note
		});

		const update = {
			title: 'test2',
			description: 'test2',
			tags: [ '#tag1', '#tag2' ],
			startTime: new Date(Date.now() - 1000 * 60 * 60),
			endTime: new Date(Date.now()),
			taskId: taskId,
			projectId: projectId,
			hours: 1,
			pinned: false
		};

		const response = await request(app)
			.get(`/api/notes/${userId}/${noteId}`)
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

		const note = await testNoteBody(userId);

		const { noteId, taskId, projectId } = await createTestNote({
			...note
		});

		const update = {
			title: 'test2',
			description: 'test2',
			tags: [ '#tag1', '#tag2' ],
			startTime: new Date(Date.now() - 1000 * 60 * 60),
			endTime: new Date(Date.now()),
			taskId: taskId,
			projectId: projectId,
			hours: 1,
			pinned: false
		};

		const response = await request(app)
			.put(`/api/notes/${userId}/${noteId}`)
			.set('Authorization', token2)
			.send(update)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);
	});
});
