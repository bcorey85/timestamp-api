import request from 'supertest';

import { db } from '../db';
import { User } from '../models/User';

jest.mock('../util/sendEmail');

beforeAll(async () => {
	await db.migrate.latest();
});

beforeEach(async () => {
	jest.clearAllMocks();
	await db.migrate.latest();
});

afterEach(async () => {
	await db.migrate.rollback();
});

afterAll(async () => {
	await db.destroy();
});

export const createTestUser = async (email: string, password: string) => {
	const { public_user_id } = await User.create(email, password);
	const token = await User.generateAuthToken(public_user_id);

	return { email, password, public_user_id, token };
};
