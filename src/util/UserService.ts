import { Project, ProjectModel } from '../models/Project';
import { Task, TaskModel } from '../models/Task';
import { Note, NoteModel } from '../models/Note';
import { User } from '../models/User';

export type itemArray = ProjectModel[] | TaskModel[] | NoteModel[];

class UserService {
	static getTutorialData = async (userId: string) => {
		const project = await Project.create({
			title: 'Demo Project',
			description:
				'Projects are the "big goals" of Timestamp. Start by creating a project for any long term goal that you want to achieve and get to work!',
			pinned: true,
			userId
		});

		const task = await Task.create({
			title: 'Demo Task',
			description:
				'Tasks help divide projects into more manageable chunks. This can help you stay organized and focused on achieving your goals.',
			pinned: true,
			projectId: project.projectId.toString(),
			tags: [ '#demo', '#task', '#tags' ],
			userId
		});

		const note = await Note.create({
			title: 'Demo Note',
			description:
				'Notes allow you to input daily progress towards your goals. They track how much time that you invest each day and document your growth.',
			pinned: true,
			projectId: project.projectId.toString(),
			taskId: task.taskId.toString(),
			tags: [ '#demo', '#note', '#tags' ],
			startTime: new Date(Date.now()).toISOString(),
			endTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
			hours: 1,
			userId
		});

		await Project.update(project.projectId, {
			notes: 1,
			tasks: 1,
			hours: 1
		});

		await Task.update(task.taskId, {
			notes: 1,
			hours: 1
		});

		return { project, task, note };
	};

	static getUserData = async (userId: string) => {
		const projects = await Project.findAll({ user_id: userId });
		const tasks = await Task.findAll({ user_id: userId });
		const notes = await Note.findAll({ user_id: userId });

		return { projects, tasks, notes };
	};

	static calculateTotalUserHours = (notes: NoteModel[]) => {
		let hours = 0;
		if (notes.length > 0) {
			hours = notes
				.map(note => Number(note.hours))
				.reduce((acc, cur) => acc + cur);
		}
		return hours;
	};

	static filterRecentItems = (itemArray: itemArray, amount: number = 10) => {
		const sortedArr = itemArray.sort(
			(a: any, b: any) => b.updatedAt.valueOf() - a.updatedAt.valueOf()
		);

		return sortedArr.slice(0, amount || 6);
	};
}

export { UserService };
