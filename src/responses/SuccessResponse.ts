import { Success } from './responseTypes';

interface SuccessParams {
	message: string;
	data: object;
}

export class SuccessResponse {
	body: Success = {
		success: true,
		message: '',
		data: {}
	};
	constructor(successParams: SuccessParams) {
		this.body.message = successParams.message;
		this.body.data = successParams.data;
	}
}
