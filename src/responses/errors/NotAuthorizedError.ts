import { CustomError } from './CustomError';
import { genericMessage } from '../responseStrings';

class NotAuthorizedError extends CustomError {
	statusCode = 403;

	constructor() {
		super(genericMessage.error.notAuthorized);
		Object.setPrototypeOf(this, NotAuthorizedError.prototype);
	}

	formatErrors() {
		return [
			{
				message: this.message
			}
		];
	}
}

export { NotAuthorizedError };
