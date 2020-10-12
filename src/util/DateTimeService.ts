import moment from 'moment';

class DateTimeService {
	static getHours = (startDate: Date, endDate: Date) => {
		const start = moment(startDate);
		const end = moment(endDate);

		const duration = moment.duration(start.diff(end)).asHours();

		return Math.abs(duration);
	};

	static parse = (date: string) => {
		return new Date(Date.parse(date));
	};
}

export { DateTimeService };
