class DateTimeService {
	static getHours = (startDate: Date, endDate: Date) => {
		return Math.abs(startDate.getTime() - endDate.getTime()) / 3600000;
	};

	static parse = (date: string) => {
		return new Date(Date.parse(date));
	};
}

export { DateTimeService };
