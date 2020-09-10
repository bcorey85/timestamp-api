const adminEmailAccount = 'timestamp.bc@gmail.com';

const sendPasswordResetEmail = jest
	.fn()
	.mockImplementation((email, resetLink) => {
		return (resetMsg = {
			to: email,
			from: `Timestamp App <${adminEmailAccount}>`,
			subject: 'Timestamp App - Reset Password Link',
			html: `A password reset request was made for Timestamp App account. <a href=${resetLink}>Click here to reset your password.</a>`
		});
	});

module.exports = { sendPasswordResetEmail };
