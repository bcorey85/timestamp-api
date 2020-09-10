import { Request, Response } from 'express';
import crypto from 'crypto';

import { User } from '../../models/User';
import { BadRequestError } from '../../responses/errors/BadRequestError';
import { SuccessResponse } from '../../responses/SuccessResponse';
import { authMessage } from '../../responses/responseStrings';

const resetPassword = async (req: Request, res: Response) => {
	const { resetToken } = req.params;
	const { password } = req.body;

	const resetHash = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	const user = await User.find({ password_reset_link: resetHash });

	if (!user) {
		throw new BadRequestError(authMessage.error.badResetRequest);
	}

	const resetLinkExpired = user.password_reset_expires < new Date(Date.now());
	if (resetLinkExpired) {
		throw new BadRequestError(authMessage.error.badResetRequest);
	}

	await User.updatePassword(user.public_user_id, password);
	await User.update(user.public_user_id, {
		password_reset_expires: null,
		password_reset_link: null
	});

	const token = await User.generateAuthToken(user.public_user_id);

	const response = new SuccessResponse({
		message: authMessage.success.passwordResetComplete,
		data: {
			id: user.public_user_id,
			token
		}
	});

	res.status(200).send(response.body);
};

export { resetPassword };
