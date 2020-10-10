import { NoteModel } from '../../models/Note';
import {
	createTestProject,
	createTestTask,
	createTestNote,
	createTestUser
} from '../../test/setup';
import { UserService } from '../UserService';

const createTestData = async () => {
	const { userId } = await createTestUser('test@gmail.com', '111111');

	const project = await createTestProject({
		title: 'test project',
		description: 'test',
		userId,
		pinned: true
	});

	const task = await createTestTask({
		title: 'test task',
		description: 'test',
		projectId: project.projectId.toString(),
		tags: [],
		userId,
		pinned: true
	});

	const note1 = await createTestNote({
		title: 'test note1',
		description: 'test',
		projectId: project.projectId.toString(),
		taskId: task.taskId.toString(),
		tags: [],
		startTime: new Date().toISOString(),
		endTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
		hours: 1,
		userId,
		pinned: true
	});

	const note2 = await createTestNote({
		title: 'test note2',
		description: 'test',
		projectId: project.projectId.toString(),
		taskId: task.taskId.toString(),
		tags: [],
		startTime: new Date().toISOString(),
		endTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
		hours: 1,
		userId,
		pinned: true
	});

	return { userId, project, task, note1, note2 };
};

describe('UserService', () => {
	it('creates demo data on first login', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');

		const tutorialData = await UserService.getTutorialData(userId);

		expect(tutorialData.project.title).toEqual("I'm a Project");
		expect(tutorialData.task.title).toEqual("I'm a Task");
		expect(tutorialData.note.title).toEqual("I'm a Note");
	});

	it('loads user data if not first login', async () => {
		const { userId, project, task, note1 } = await createTestData();

		const userData = await UserService.getUserData(userId);

		expect(userData.projects.length).toBe(1);
		expect(userData.tasks.length).toBe(1);
		expect(userData.notes.length).toBe(2);

		expect(userData.projects[0].title).toEqual(project.title);
		expect(userData.tasks[0].title).toEqual(task.title);
		expect(userData.notes[0].title).toEqual(note1.title);
	});

	it('calculates user hours and returns amount if notes preset', async () => {
		const { userId } = await createTestData();

		const userData = await UserService.getUserData(userId);
		const hours = UserService.calculateTotalUserHours(userData.notes);

		expect(hours).toEqual(2);
	});

	it('returns 0 user hours if no notes found', async () => {
		const { userId } = await createTestUser('test@gmail.com', '111111');

		const userData = await UserService.getUserData(userId);
		const hours = UserService.calculateTotalUserHours(userData.notes);

		expect(hours).toEqual(0);
	});

	it('sorts recent items if passed an array of items', async () => {
		const { userId } = await createTestData();

		const userData = await UserService.getUserData(userId);

		const sorted = UserService.filterRecentItems(userData.notes, 1);

		expect(sorted.length).toEqual(1);
	});
});
