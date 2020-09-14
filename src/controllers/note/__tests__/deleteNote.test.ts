import request from 'supertest';
import { app } from '../../../app';
import {
	createMessage,
	genericMessage,
	noteMessage
} from '../../../responses/responseStrings';
import { Note } from '../../../models/Note';
import {
	createTestUser,
	createTestProject,
	createTestNote,
	createTestTask
} from '../../../test/setup';
import { Project } from '../../../models/Project';

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

describe('Delete Note Controller', () => {
	it('deletes note from db', async () => {
		const { public_user_id, user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const noteBody = await testNote(user_id);

		//@ts-ignore
		const { note_id } = await createTestNote({ ...noteBody });

		const response = await request(app)
			.delete(`/api/notes/${public_user_id}/${note_id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(noteMessage.success.deleteNote);

		const noteTest = await Note.find({ title: noteBody.title });
		expect(noteTest).toBe(undefined);
	});

	it('throws error if note not found', async () => {
		const { public_user_id, user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const noteBody = await testNote(user_id);
		//@ts-ignore
		const note = await createTestNote({ ...noteBody });

		const fakeId = 500;
		const response = await request(app)
			.delete(`/api/notes/${public_user_id}/${fakeId}`)
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
		const { public_user_id, user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const noteBody = await testNote(user_id);
		//@ts-ignore
		const note = await createTestNote({ ...noteBody });

		const response = await request(app)
			.delete(`/api/notes/${public_user_id}/${note.note_id}`)
			.expect(401);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthenticated
		);

		const noteTest = await Note.find({ title: note.title });

		expect(noteTest.title).toBe(noteBody.title);
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

		const noteBody = await testNote(user_id);
		//@ts-ignore
		const note = await createTestNote({ ...noteBody });

		const response = await request(app)
			.delete(`/api/notes/${public_user_id}/${note.note_id}`)
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
