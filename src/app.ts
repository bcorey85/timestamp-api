import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import helmet from 'helmet';
import 'express-async-errors';

import { authRouter } from './routes/auth';
import { userRouter } from './routes/user';
import { projectRouter } from './routes/project';
import { taskRouter } from './routes/task';
import { noteRouter } from './routes/note';
import { activityRouter } from './routes/activity';
import { factRouter } from './routes/fact';

import { errorHandler } from './middleware/errorHandler';
import { NotFoundError } from './responses/errors/NotFoundError';

const app = express();
app.use(express.json());

// Security
app.use(cors());
app.use(
	rateLimit({
		// Limit to 200 requests in 15 mins
		windowMs: 15 * 60 * 1000,
		max: 200
	})
);
app.use(hpp());
app.use(helmet());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);
app.use('/api/notes', noteRouter);
// app.use('/api/activity', activityRouter);
// app.use('/api/facts', factRouter);

app.all('*', () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
