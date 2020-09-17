import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../responses/errors/NotAuthorizedError';
import { User, UserModel } from '../models/User';
import { NotAuthenticatedError } from '../responses/errors/NotAuthenticatedError';

declare global {
	namespace Express {
		interface Request {
			user: {
				user_id: string;
			};
		}
	}
}

interface UserPayload {
	user: string;
	iat: Date;
	exp: Date;
}

const authUser = async (req: Request, res: Response, next: NextFunction) => {
	if (!req.headers.authorization) {
		throw new NotAuthenticatedError();
	}

	const token = req.headers.authorization.replace('Bearer ', '');

	if (!token) {
		throw new NotAuthenticatedError();
	}

	try {
		const payload = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as UserPayload;

		const user = (await User.find({
			user_id: payload.user
		})) as UserModel;

		if (!user) {
			throw new NotAuthorizedError();
		}

		if (user.user_id.toString() !== req.params.userId) {
			throw new NotAuthorizedError();
		}

		req.user = {
			user_id: user.user_id
		};

		next();
	} catch (error) {
		if (error.message === 'jwt expired') {
			throw new NotAuthorizedError();
		}

		throw error;
	}
};

export { authUser };
