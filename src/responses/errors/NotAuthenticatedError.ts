import { CustomError } from './CustomError';
import { genericMessage } from '../responseStrings';

class NotAuthenticatedError extends CustomError {
	statusCode = 401;

	constructor() {
		super(genericMessage.error.notAuthenticated);
		Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
	}

	formatErrors() {
		return [
			{
				message: this.message
			}
		];
	}
}

export { NotAuthenticatedError };
