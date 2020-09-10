import request from 'supertest';
import { app } from '../../../app';
import {
	authMessage,
	requestValidationMessage
} from '../../../responses/responseStrings';
import { User } from '../../../models/User';
import { createTestUser } from '../../../test/setup';

describe('Reset Password Controller', () => {
	it('resets password in database and sends new auth token', async () => {
		const { email, password, public_user_id } = await createTestUser(
			'test@test.com',
			'123456'
		);

		const token = await User.generateResetPasswordToken(public_user_id);

		const response = await request(app)
			.put(`/api/auth/reset-password/${token}`)
			.send({ password: '111111', passwordConfirm: '111111' })
			.expect(200);

		expect(response.body.message).toEqual(
			authMessage.success.passwordResetComplete
		);

		const user = await User.find({ email });

		const passwordMatch = await User.comparePassword(user, '111111');

		expect(passwordMatch).toBe(true);
	});

	it('throws error if passwords dont match', async () => {
		const { email, password, public_user_id } = await createTestUser(
			'test@test.com',
			'123456'
		);

		const response = await request(app)
			.put(`/api/auth/reset-password/not-a-token`)
			.send({ password: '111111', passwordConfirm: '111112' })
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			requestValidationMessage.error.passwordNotMatch
		);

		const user = await User.find({ email });

		const passwordMatch = await User.comparePassword(user, '111111');

		expect(passwordMatch).toBe(false);
	});

	it('throws error if reset token is invalid', async () => {
		const { email, password, public_user_id } = await createTestUser(
			'test@test.com',
			'123456'
		);

		const response = await request(app)
			.put(`/api/auth/reset-password/not-a-token`)
			.send({ password: '111111', passwordConfirm: '111111' })
			.expect(400);

		expect(response.body.success).toBe(false);
		expect(response.body.errors[0].message).toEqual(
			authMessage.error.badResetRequest
		);

		const user = await User.find({ email });

		const passwordMatch = await User.comparePassword(user, '111111');

		expect(passwordMatch).toBe(false);
	});

	it.todo('throws error if reset token is expired');
});
