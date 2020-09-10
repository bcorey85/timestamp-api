export interface Success {
	success: boolean;
	message: string;
	data?: object;
}

export interface Error {
	message: string;
	field?: string;
}

export interface ErrorResponse {
	success: boolean;
	errors: Error[];
}
