import request from 'supertest';
import { app } from '../../../app';
import { authMessage } from '../../../responses/responseStrings';
import { User } from '../../../models/User';
import { sendPasswordResetEmail } from '../../../util/sendEmail';
import { createTestUser } from '../../../test/setup';

describe('Forgot Password Controller', () => {
	it('sends forgot password email and adds reset token to db', async () => {
		const { email, password } = await createTestUser(
			'test@test.com',
			'123456'
		);

		const response = await request(app)
			.post('/api/auth/forgot-password')
			.send({ email })
			.expect(200);

		expect(response.body.message).toEqual(
			authMessage.success.passwordResetRequest
		);
		expect(sendPasswordResetEmail).toHaveBeenCalled();
		expect((sendPasswordResetEmail as jest.Mock).mock.calls[0][0]).toEqual(
			email
		);

		const user = await User.find({ email });
		expect(user.password_reset_link).not.toBe(null);
		expect(user.password_reset_expires).not.toBe(null);
	});

	it('returns generic response and doesnt send email if no user found', async () => {
		const { email, password } = await createTestUser(
			'test@test.com',
			'123456'
		);

		const response = await request(app)
			.post('/api/auth/forgot-password')
			.send({ email: 'test2@gmail.com' })
			.expect(200);

		expect(response.body.message).toEqual(
			authMessage.success.passwordResetRequest
		);
		expect(sendPasswordResetEmail).not.toHaveBeenCalled();

		const user = await User.find({ email });
		expect(user.password_reset_link).toBe(null);
		expect(user.password_reset_expires).toBe(null);
	});
});
