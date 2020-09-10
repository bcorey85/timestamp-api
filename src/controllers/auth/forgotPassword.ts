import { Request, Response } from 'express';

import { SuccessResponse } from '../../responses/SuccessResponse';
import { authMessage } from '../../responses/responseStrings';
import { User } from '../../models/User';
import { sendPasswordResetEmail } from '../../util/sendEmail';

const forgotPassword = async (req: Request, res: Response) => {
	const { email } = req.body;

	const user = await User.find({ email });

	// Mask response if email does not exist
	if (!user) {
		const invalidEmailResponse = new SuccessResponse({
			message: authMessage.success.passwordResetRequest,
			data: {}
		});

		return res.status(200).send(invalidEmailResponse.body);
	}

	const resetToken = await User.generateResetPasswordToken(
		user.public_user_id
	);

	const resetLink = `${process.env
		.FRONTEND_URL}/auth/reset-password/${resetToken}`;

	await sendPasswordResetEmail(email, resetLink);

	const response = new SuccessResponse({
		message: authMessage.success.passwordResetRequest,
		data: {
			token: resetToken
		}
	});

	res.status(200).send(response.body);
};

export { forgotPassword };
