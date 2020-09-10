import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../responses/errors/RequestValidationError';

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throw new RequestValidationError(errors.array());
	}

	next();
};

export { validateRequest };
