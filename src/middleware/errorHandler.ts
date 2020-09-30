import { Response, Request, NextFunction } from 'express';
import { CustomError } from '../responses/errors/CustomError';
import { genericMessage } from '../responses/responseStrings';
import { ErrorResponse } from '../responses/responseTypes';

const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err instanceof CustomError) {
		const serverResponse: ErrorResponse = {
			success: false,
			errors: err.formatErrors()
		};
		return res.status(err.statusCode).send(serverResponse);
	}

	return res.status(500).send({
		errors: [ { message: genericMessage.error.serverError } ]
	});
};

export { errorHandler };
