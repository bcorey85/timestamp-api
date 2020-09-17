import { Request, Response } from 'express';
import moment from 'moment';

import { User } from '../../models/User';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { userMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';
import { Project, ProjectModel } from '../../models/Project';
import { Task, TaskModel } from '../../models/Task';
import { Note, NoteModel } from '../../models/Note';

const getUserData = async (userId: string) => {
	const projects = await Project.findAll(userId);
	const tasks = await Task.findAll(userId);
	const notes = await Note.findAll(userId);

	return { projects, tasks, notes };
};

const calculateTotalUserHours = (notes: NoteModel[]) => {
	let hours;
	if (notes.length > 0) {
		hours = notes
			.map(note => Number(note.hours))
			.reduce((acc, cur) => acc + cur)
			.toFixed(1);
	}
	return hours;
};

type itemArray = ProjectModel[] | TaskModel[] | NoteModel[];

const filterRecentItems = (itemArray: itemArray, amount: number = 10) => {
	const sortedArr = itemArray.sort(
		(a: any, b: any) => b.updated_at.valueOf() - a.updated_at.valueOf()
	);

	return sortedArr.slice(0, amount);
};

const getUserById = async (req: Request, res: Response) => {
	const { userId } = req.params;
	const user = await User.find({ user_id: userId });

	if (!user) {
		throw new NotFoundError();
	}

	const { projects, notes, tasks } = await getUserData(user.user_id);
	const hours = calculateTotalUserHours(notes);

	const userResponse = {
		email: user.email,
		last_login: user.last_login,
		created_at: user.created_at,
		user_id: user.user_id,
		projects,
		tasks,
		notes,
		hours: hours || 0,
		recentItems: {
			notes: filterRecentItems(notes, 6),
			tasks: filterRecentItems(tasks, 6),
			projects: filterRecentItems(projects, 6)
		}
	};

	const response = new SuccessResponse({
		message: userMessage.success.getUser,
		data: {
			user: userResponse
		}
	});

	res.status(200).send(response.body);
};

export { getUserById };
