import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../responses/errors/NotAuthorizedError';
import { User, UserModel } from '../models/User';

declare global {
	namespace Express {
		interface Request {
			user: {
				user_id: string;
				public_user_id: string;
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
		throw new NotAuthorizedError();
	}

	const token = req.headers.authorization.replace('Bearer ', '');

	if (!token) {
		throw new NotAuthorizedError();
	}

	try {
		const payload = jwt.verify(
			token,
			process.env.JWT_SECRET!
		) as UserPayload;

		const user = (await User.find({
			public_user_id: payload.user
		})) as UserModel;

		if (!user) {
			throw new NotAuthorizedError();
		}

		if (user.public_user_id !== req.params.userId) {
			throw new NotAuthorizedError();
		}

		req.user = {
			user_id: user.user_id,
			public_user_id: payload.user
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
