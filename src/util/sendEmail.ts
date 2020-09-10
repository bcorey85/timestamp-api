import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const adminEmailAccount = process.env.ADMIN_EMAIL;

export const sendPasswordResetEmail = async (
	email: string,
	resetLink: string
): Promise<void> => {
	const msg = {
		// to: email,
		to: process.env.TEST_EMAIL!,
		from: `Timestamp App <${adminEmailAccount}>`,
		subject: 'Timestamp App - Reset Password Link',
		html: `A password reset request was made for Timestamp account. <a href=${resetLink}>Click here to reset your password.</a>`
	};

	await sgMail.send(msg);
};
