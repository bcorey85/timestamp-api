import { Request, Response } from 'express';

import { SuccessResponse } from '../../responses/SuccessResponse';
import { authMessage } from '../../responses/responseStrings';
import { User, UserRequest } from '../../models/User';
import { AuthFailureError } from '../../responses/errors/AuthFailureError';

const login = async (req: Request, res: Response) => {
	const { password, email }: UserRequest = req.body;

	const user = await User.find({ email });

	if (!user) {
		throw new AuthFailureError(authMessage.error.invalidCredentials);
	}

	const passwordMatch = await User.comparePassword(user, password);

	if (!passwordMatch) {
		throw new AuthFailureError(authMessage.error.invalidCredentials);
	}

	const token = await User.generateAuthToken(user.public_user_id);

	await User.update(user.public_user_id, {
		last_login: new Date(Date.now()).toISOString()
	});

	const response = new SuccessResponse({
		message: authMessage.success.loginValid,
		data: {
			id: user.public_user_id,
			token
		}
	});

	res.status(200).send(response.body);
};

export { login };
