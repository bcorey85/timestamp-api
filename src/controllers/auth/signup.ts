import { Request, Response } from 'express';

import { authMessage } from '../../responses/responseStrings';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { User, UserRequest } from '../../models/User';
import { AuthFailureError } from '../../responses/errors/AuthFailureError';

const signup = async (req: Request, res: Response) => {
	const { email, password }: UserRequest = req.body;

	const existingUser = await User.find({ email });

	if (existingUser) {
		throw new AuthFailureError(authMessage.error.emailInUse);
	}

	const user = await User.create(email, password);
	const token = await User.generateAuthToken(user.user_id);

	const response = new SuccessResponse({
		message: authMessage.success.registerSuccess,
		data: {
			id: user.user_id,
			token
		}
	});
	return res.status(201).send(response.body);
};

export { signup };
