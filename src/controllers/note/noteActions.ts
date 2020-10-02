import { Request, Response } from 'express';

const noteActions = (req: Request, res: Response) => {
	console.log(req.query);
};

export { noteActions };
