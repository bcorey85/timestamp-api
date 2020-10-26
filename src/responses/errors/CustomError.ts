import { Error } from '../responseTypes';

abstract class CustomError extends Error {
	abstract statusCode: number;

	constructor(message: string) {
		super(message);

		// Typescript hack to set prototype explicitly due to issues with subclassing Error
		// https://stackoverflow.com/questions/41102060/typescript-extending-error-class/41102306#41102306
		// Required for errorHandler middleware to catch custom errors and format before
		// sending response
		Object.setPrototypeOf(this, CustomError.prototype);
	}

	abstract formatErrors(): Error[];
}

export { CustomError };
