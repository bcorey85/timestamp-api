import { CustomError } from './CustomError';
import { genericMessage } from '../responseStrings';

export class NotAuthenticatedError extends CustomError {
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
