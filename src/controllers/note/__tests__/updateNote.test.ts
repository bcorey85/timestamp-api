import request from 'supertest';
import { app } from '../../../app';
import {
	createMessage,
	genericMessage
} from '../../../responses/responseStrings';
import { Note } from '../../../models/Note';
import { createTestUser } from '../../../test/setup';

describe('Update Note Controller', () => {
	it.todo('update note in db');

	it.todo('throws error if no title');

	it.todo('throws error if no description');

	it.todo('throws error if not logged in');

	it.todo('throws error if not authorized');
});
