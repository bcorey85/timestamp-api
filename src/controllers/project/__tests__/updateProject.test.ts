import request from 'supertest';
import { app } from '../../../app';
import {
	authMessage,
	requestValidationMessage,
	projectMessage,
	genericMessage
} from '../../../responses/responseStrings';
import { Project } from '../../../models/Project';
import { createTestUser, createTestProject } from '../../../test/setup';

describe('Update Project Controller', () => {
	it('updates project in db', async () => {
		const { user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const project = await createTestProject({
			title: 'test',
			description: 'test',
			userId: user_id,
			pinned: false
		});

		const update = {
			title: 'test2',
			description: 'test2',
			pinned: true
		};

		const { project_id } = await Project.find({ title: project.title });
		const response = await request(app)
			.put(`/api/projects/${user_id}/${project_id}`)
			.set('Authorization', token)
			.send(update)
			.expect(200);

		expect(response.body.success).toBe(true);
		expect(response.body.message).toEqual(
			projectMessage.success.updateProject
		);

		const updatedProject = await Project.find({ user_id });

		expect(updatedProject.title).toEqual(update.title);
		expect(updatedProject.description).toEqual(update.description);
		expect(updatedProject.pinned).toEqual(update.pinned);
	});

	it.todo('throws error if no title');

	it.todo('throws error if no description');

	it('throws error if not found', async () => {
		const { user_id, token } = await createTestUser(
			'test@gmail.com',
			'111111'
		);

		const project = await createTestProject({
			title: 'test',
			description: 'test',
			userId: user_id,
			pinned: false
		});

		const update = {
			title: 'test2',
			description: 'test2',
			pinned: true
		};

		const fakeProjectId = 500;
		const response = await request(app)
			.put(`/api/projects/${user_id}/${fakeProjectId}`)
			.set('Authorization', token)
			.send(update)
			.expect(404);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notFound
		);

		const updatedProject = await Project.find({ user_id });

		expect(updatedProject.title).toEqual(project.title);
		expect(updatedProject.description).toEqual(project.description);
		expect(updatedProject.pinned).toEqual(project.pinned);
	});

	it('throws error if not logged in', async () => {
		const { user_id } = await createTestUser('test@gmail.com', '111111');

		const project = await createTestProject({
			title: 'test',
			description: 'test',
			userId: user_id,
			pinned: false
		});

		const update = {
			title: 'test2',
			description: 'test2',
			pinned: true
		};

		const { project_id } = await Project.find({ title: project.title });
		const response = await request(app)
			.put(`/api/projects/${user_id}/${project_id}`)
			.send(update)
			.expect(401);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthenticated
		);

		const updatedProject = await Project.find({ user_id });

		expect(updatedProject.title).toEqual(project.title);
		expect(updatedProject.description).toEqual(project.description);
		expect(updatedProject.pinned).toEqual(project.pinned);
	});

	it('throws error if not authorized', async () => {
		const { user_id } = await createTestUser('test@gmail.com', '111111');

		const { token: token2 } = await createTestUser(
			'test2@gmail.com',
			'111111'
		);

		const project = await createTestProject({
			title: 'test',
			description: 'test',
			userId: user_id,
			pinned: false
		});

		const update = {
			title: 'test2',
			description: 'test2',
			pinned: true
		};

		const { project_id } = await Project.find({ title: project.title });
		const response = await request(app)
			.put(`/api/projects/${user_id}/${project_id}`)
			.set('Authorization', token2)
			.send(update)
			.expect(403);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			genericMessage.error.notAuthorized
		);

		const updatedProject = await Project.find({ user_id });

		expect(updatedProject.title).toEqual(project.title);
		expect(updatedProject.description).toEqual(project.description);
		expect(updatedProject.pinned).toEqual(project.pinned);
	});
});
