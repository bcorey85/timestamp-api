import { Request, Response } from 'express';

import { SuccessResponse } from '../../responses/SuccessResponse';
import { userMessage } from '../../responses/responseStrings';
import { User } from '../../models/User';

const updateUserById = async (req: Request, res: Response) => {
	const { password, email } = req.body;
	const { userId } = req.params;

	if (req.body.password) {
		await User.updatePassword(userId, password);
	}

	if (req.body.email) {
		await User.update(userId, {
			email,
			updated_at: new Date(Date.now())
		});
	}

	const response = new SuccessResponse({
		message: userMessage.success.updateUser,
		data: {}
	});
	return res.status(200).send(response.body);
};

export { updateUserById };
