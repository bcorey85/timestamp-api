import { CustomError } from './CustomError';
import { ValidationError } from 'express-validator';
import { genericMessage } from '../responseStrings';

export class RequestValidationError extends CustomError {
	statusCode = 400;

	constructor(public errors: ValidationError[]) {
		super(genericMessage.error.requestValidation);
		Object.setPrototypeOf(this, RequestValidationError.prototype);
	}

	formatErrors() {
		return this.errors.map(error => {
			return {
				message: error.msg,
				field: error.param
			};
		});
	}
}
