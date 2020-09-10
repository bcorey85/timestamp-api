import { CustomError } from './CustomError';

export class AuthFailureError extends CustomError {
	statusCode = 400;

	constructor(public message: string) {
		super(message);
		Object.setPrototypeOf(this, AuthFailureError.prototype);
	}

	formatErrors() {
		return [
			{
				message: this.message
			}
		];
	}
}
