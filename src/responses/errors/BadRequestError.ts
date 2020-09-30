import { CustomError } from './CustomError';

class BadRequestError extends CustomError {
	statusCode = 400;

	constructor(public message: string) {
		super(message);
		Object.setPrototypeOf(this, BadRequestError.prototype);
	}

	formatErrors() {
		return [
			{
				message: this.message
			}
		];
	}
}

export { BadRequestError };
