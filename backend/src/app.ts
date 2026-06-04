import express from 'express';
import cors from 'cors';
import router from './routes';
import { errorMiddleware } from './middlewares/error.middleware';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true
    })
);
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', router);

app.use(errorMiddleware);

export default app;
