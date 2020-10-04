import { ItemService } from '../ItemService';

describe('ItemService', () => {
	it('merges tag array into string if present', () => {
		const tags = [ '#1', '#2', '#3' ];

		const merged = ItemService.mergeTags(tags);

		expect(merged).toEqual('#1,#2,#3');
	});

	it('returns null if no tags passed', () => {
		const tags = null;

		const merged = ItemService.mergeTags(tags);

		expect(merged).toEqual(null);
	});

	it('calculates hours between start and end date time strings', () => {
		const start = new Date().toISOString();
		const end = new Date(Date.now() + 1000 * 60 * 60 * 1).toISOString();

		const hours = ItemService.calcHours(start, end);

		expect(hours).toEqual(1);
	});
});
