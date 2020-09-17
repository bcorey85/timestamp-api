import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { db } from '../db';

export interface UserRequest {
	email: string;
	password: string;
}

export interface UserModel {
	user_id: string;
	email: string;
	password: string;
	created_at: Date;
	last_login: Date;
	password_reset_link?: string;
	password_reset_expires?: Date;
}

interface SearchCriteria {
	[key: string]: any;
}

interface Update {
	[key: string]: any;
}

class User {
	static create = async (
		email: string,
		password: string
	): Promise<UserModel> => {
		const hashed = await bcrypt.hash(password, 10);
		const user = await db('users')
			.insert({ email, password: hashed })
			.returning('*');

		return user[0];
	};

	static find = async (searchCriteria: SearchCriteria) => {
		const user = await db.select('*').from('users').where(searchCriteria);
		return user[0];
	};

	static findAll = async (): Promise<UserModel[]> => {
		const users = await db.select('*').from('users');
		return users;
	};

	static update = async (userId: string, update: Update) => {
		if (update.hasOwnProperty('password')) {
			// prevent updating password directly
			delete update.password;
		}

		const user = await db('users')
			.update(update)
			.where({ user_id: userId })
			.returning('*');

		return user;
	};

	static delete = async (userId: string) => {
		await db('users').del().where({ user_id: userId });
	};

	static generateAuthToken = async (userid: string): Promise<string> => {
		return jwt.sign({ user: userid }, process.env.JWT_SECRET!, {
			expiresIn: '1d'
		});
	};

	static comparePassword = async (
		user: UserModel,
		password: string
	): Promise<boolean> => {
		const match = await bcrypt.compare(password, user.password);
		return match;
	};

	static updatePassword = async (userid: string, password: string) => {
		const hashed = await bcrypt.hash(password, 10);

		await db('users')
			.update({
				password: hashed,
				updated_at: new Date(Date.now())
			})
			.where({ user_id: userid });
	};

	static generateResetPasswordToken = async (
		userid: string
	): Promise<string> => {
		const resetToken = crypto.randomBytes(32).toString('hex');
		const resetHash = crypto
			.createHash('sha256')
			.update(resetToken)
			.digest('hex');
		const resetExpires = new Date(Date.now() + 10 * 60 * 1000);

		await db('users')
			.update({
				password_reset_link: resetHash,
				password_reset_expires: resetExpires
			})
			.where({ user_id: userid });

		return resetToken;
	};
}

export { User };
