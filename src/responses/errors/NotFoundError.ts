import { CustomError } from './CustomError';
import { genericMessage } from '../responseStrings';

class NotFoundError extends CustomError {
	statusCode = 404;

	constructor() {
		super(genericMessage.error.notFound);
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}

	formatErrors() {
		return [
			{
				message: this.message
			}
		];
	}
}

export { NotFoundError };
