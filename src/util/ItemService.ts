import { DateTimeService } from './DateTimeService';

class ItemService {
	static mergeTags = (tags: string[] | null) => {
		if (!tags) {
			return null;
		}

		return tags.join(',');
	};

	static calcHours = (startTime: string, endTime: string) => {
		const startDate = DateTimeService.parse(startTime);
		const endDate = DateTimeService.parse(endTime);

		return DateTimeService.getHours(startDate, endDate);
	};
}

export { ItemService };
