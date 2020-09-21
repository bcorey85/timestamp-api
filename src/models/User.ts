import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { db } from '../db';

export interface UserRequest {
	email: string;
	password: string;
}

export interface UserModel {
	userId: string;
	email: string;
	password: string;
	createdAt: Date;
	lastLogin: Date;
	passwordResetLink?: string;
	passwordResetExpires?: Date;
}

interface SearchCriteria {
	[key: string]: any;
}

interface Update {
	[key: string]: any;
}

const userAliases = {
	userId: 'user_id',
	email: 'email',
	password: 'password',
	createdAt: 'created_at',
	updatedAt: 'updated_at',
	lastLogin: 'last_login',
	passwordResetLink: 'password_reset_link',
	passwordResetExpires: 'password_reset_expires'
};

class User {
	static create = async (
		email: string,
		password: string
	): Promise<UserModel> => {
		const hashed = await bcrypt.hash(password, 10);
		const user = await db('users')
			.insert({ email, password: hashed })
			.returning('*');

		return {
			userId: user[0].user_id,
			email: user[0].email,
			password: user[0].password,
			createdAt: user[0].created_at,
			lastLogin: user[0].last_login,
			passwordResetLink: user[0].password_reset_link,
			passwordResetExpires: user[0].password_reset_expires
		};
	};

	static find = async (
		searchCriteria: SearchCriteria
	): Promise<UserModel> => {
		const user = await db
			.select(userAliases)
			.from('users')
			.where(searchCriteria);

		return user[0];
	};

	static findAll = async (): Promise<UserModel[]> => {
		const users = await db.select(userAliases).from('users');
		return users;
	};

	static update = async (
		userId: string,
		update: Update
	): Promise<UserModel> => {
		if (update.hasOwnProperty('password')) {
			// prevent updating password directly
			delete update.password;
		}

		const user = await db('users')
			.update(update)
			.where({ user_id: userId })
			.returning('*');

		return {
			userId: user[0].user_id,
			email: user[0].email,
			password: user[0].password,
			createdAt: user[0].created_at,
			lastLogin: user[0].last_login,
			passwordResetLink: user[0].password_reset_link,
			passwordResetExpires: user[0].password_reset_expires
		};
	};

	static delete = async (userId: string) => {
		await db('users').del().where({ user_id: userId });
	};

	static generateAuthToken = async (userId: string): Promise<string> => {
		return jwt.sign({ user: userId }, process.env.JWT_SECRET!, {
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

	static updatePassword = async (userId: string, password: string) => {
		const hashed = await bcrypt.hash(password, 10);

		await db('users')
			.update({
				password: hashed,
				updated_at: new Date(Date.now())
			})
			.where({ user_id: userId });
	};

	static generateResetPasswordToken = async (
		userId: string
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
			.where({ user_id: userId });

		return resetToken;
	};
}

export { User };
