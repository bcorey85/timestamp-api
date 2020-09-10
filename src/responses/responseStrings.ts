export const authMessage = {
	success: {
		registerSuccess: 'Successfully registered new user',
		loginValid: 'User was successfully logged in',
		passwordResetRequest:
			'Please check the provided email for a reset link',
		passwordResetComplete: 'Your password has been updated successfully'
	},
	error: {
		emailInUse: 'Please try new credentials',
		badResetRequest: 'Please try your password reset request again',
		invalidCredentials: 'Please try new credentials'
	}
};

export const userMessage = {
	success: {
		getUser: 'User request successful',
		updateUser: 'User update successful',
		deleteUser: 'User delete successful'
	},
	error: {}
};

export const noteMessage = {
	success: {
		getNote: 'Note request success',
		updateNote: 'Note update successful',
		deleteNote: 'Note delete successful'
	},
	error: {}
};

export const taskMessage = {
	success: {
		getTask: 'Task request success',
		updateTask: 'Task update successful',
		deleteTask: 'Task delete successful'
	},
	error: {}
};

export const projectMessage = {
	success: {
		getProject: 'Project request success',
		updateProject: 'Project update successful',
		deleteProject: 'Project delete successful'
	},
	error: {}
};

export const requestValidationMessage = {
	error: {
		email: 'Please add a valid email',
		emailInUse: 'Please try a different email address',
		password: 'Please add a valid password with at least 6 characters',
		passwordNotMatch: 'Passwords do not match',
		userId: 'Please add a valid user id',
		noteId: 'Please add a valid note id',
		taskId: 'Please add a valid task id',
		projectId: 'Please add a valid project id'
	}
};

export const genericMessage = {
	success: {
		resourceFound: 'Successfully located requested resource'
	},
	error: {
		requestValidation: 'Request validation failure',
		serverError:
			'An unknown server error occurred. Please try again later.',
		notFound: 'Unable to locate the requested resource.',
		notAuthenticated: 'Please login and try your request again.',
		notAuthorized: 'Unable to access the requested resource.'
	}
};

export const createMessage = {
	success: {
		project: 'Project created successfully',
		task: 'Task created successfully',
		note: 'Note created successfully'
	},
	error: {
		title: 'Please add a title to your entry',
		description: 'Please add a description to your entry',
		project: 'Please add a project',
		task: 'Please add a task',
		start: 'Please add a start time',
		end: 'Please add an end time'
	}
};
