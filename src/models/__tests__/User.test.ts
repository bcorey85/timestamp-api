import jwt from 'jsonwebtoken';
import { User } from '../User';

import { createTestUser } from '../../test/setup';

interface JwtResponse {
	user: string;
	iat: number;
}

describe('Create User', () => {
	it('should create a user in database and return a user_id', async () => {
		const newUser = {
			email: 'test@gmail.com',
			password: '123456'
		};

		await User.create(newUser.email, newUser.password);

		const users = await User.findAll();

		expect(users[0].email).toEqual(newUser.email);
	});
});

describe('Find User', () => {
	it('should return a user if valid criteria supplied', async () => {
		const userOne = await createTestUser('test@gmail.com', '123456');
		const response1 = await User.find({ email: userOne.email });
		expect(response1.email).toEqual(userOne.email);

		const userTwo = await createTestUser('test2@gmail.com', '123456');

		const response2 = await User.find({
			user_id: userTwo.userId
		});

		expect(response2.userId).toEqual(userTwo.userId);
	});
});

describe('Find All Users', () => {
	it('should return a list of users', async () => {
		const userOne = await createTestUser('test@gmail.com', '123456');
		const userTwo = await createTestUser('test2@gmail.com', '123456');
		const userThree = await createTestUser('test3@gmail.com', '123456');

		const users = await User.findAll();
		expect(users.length).toEqual(3);
	});
});

describe('Generate Auth Token', () => {
	it('should return a valid token if userid supplied', async () => {
		const token = await User.generateAuthToken('userid');
		expect(token).not.toBe(null);
		const decoded = (await jwt.verify(
			token,
			process.env.JWT_SECRET!
		)) as JwtResponse;

		expect(decoded.user).toEqual('userid');
	});
});

describe('Compare Password', () => {
	it('should return true if passwords match', async () => {
		const user = await User.create('test@gmail.com', '123456');
		const isMatch = await User.comparePassword(user, '123456');
		expect(isMatch).toBe(true);
	});

	it('should return false if passwords not match', async () => {
		const user = await User.create('test@gmail.com', '123456');
		const isMatch = await User.comparePassword(user, '123457');
		expect(isMatch).toBe(false);
	});
});

describe('Update user', () => {
	it('updates user in db', async () => {
		const user = await User.create('test@gmail.com', '123456');

		const newEmail = 'test2@gmail.com';
		await User.update(user.userId, {
			email: newEmail
		});

		const updatedUser = await User.find({
			user_id: user.userId
		});

		expect(updatedUser.email).toBe(newEmail);
	});

	it('prevents updating password directly', async () => {
		const user = await User.create('test@gmail.com', '123456');

		const newPass = '111111';
		const newEmail = 'test2@gmail.com';
		await User.update(user.userId, {
			password: newPass,
			email: newEmail
		});

		const updatedUser = await User.find({
			user_id: user.userId
		});

		const passMatch = await User.comparePassword(updatedUser, newPass);

		expect(passMatch).toBe(false);
	});
});

describe('Delete user', () => {
	it('should delete user from db', async () => {
		const user = await User.create('test@gmail.com', '123456');

		await User.delete(user.userId);

		const users = await User.findAll();

		expect(users).toStrictEqual([]);
	});
});
