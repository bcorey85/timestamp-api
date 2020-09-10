class DateTimeService {
	static getHours = (startDate: Date, endDate: Date) => {
		return parseFloat(
			(Math.abs(startDate.getTime() - endDate.getTime()) /
				3600000).toFixed(2)
		);
	};

	static parse = (date: string) => {
		return new Date(Date.parse(date));
	};
}

export { DateTimeService };
