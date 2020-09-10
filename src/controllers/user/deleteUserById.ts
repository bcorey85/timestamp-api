import { Request, Response } from 'express';

import { User } from '../../models/User';
import { NotFoundError } from '../../responses/errors/NotFoundError';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { userMessage } from '../../responses/responseStrings';

const deleteUserById = async (req: Request, res: Response) => {
	const { userId } = req.params;

	const user = await User.find({ public_user_id: userId });

	if (!user) {
		throw new NotFoundError();
	}

	const response = new SuccessResponse({
		message: userMessage.success.deleteUser,
		data: {}
	});

	await User.delete(user.public_user_id);

	res.send(response.body);
};

export { deleteUserById };
