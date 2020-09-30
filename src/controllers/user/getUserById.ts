import { Request, Response } from 'express';

import { User } from '../../models/User';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { userMessage } from '../../responses/responseStrings';
import { NotFoundError } from '../../responses/errors/NotFoundError';

import { UserService } from '../../util/UserService';

const getUserById = async (req: Request, res: Response) => {
	const { userId } = req.params;
	const user = await User.find({ user_id: userId });

	if (!user) {
		throw new NotFoundError();
	}

	const existingData = await UserService.getUserData(user.userId);

	const secondsSinceCreation =
		(new Date().getTime() - user.createdAt.getTime()) / 1000;

	const isInitialLogin = secondsSinceCreation < 2;

	let projects, notes, tasks;
	if (isInitialLogin) {
		const tutorialData = await UserService.getTutorialData(user.userId);
		projects = [ tutorialData.project ];
		tasks = [ tutorialData.task ];
		notes = [ tutorialData.note ];
	} else {
		projects = existingData.projects;
		tasks = existingData.tasks;
		notes = existingData.notes;
	}

	const hours = UserService.calculateTotalUserHours(notes);

	const userResponse = {
		email: user.email,
		lastLogin: user.lastLogin,
		createdAt: user.createdAt,
		userId: user.userId,
		projects,
		tasks,
		notes,
		hours: hours || 0,
		recentItems: {
			notes: UserService.filterRecentItems(notes, 6),
			tasks: UserService.filterRecentItems(tasks, 6),
			projects: UserService.filterRecentItems(projects, 6)
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
