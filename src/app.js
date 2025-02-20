import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import AuthRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';


// created app here..

const app = express();


// middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());

// auth routes..
app.use('/api/auth', AuthRoutes);


// API for testing.
app.get("/", (req, res) => {
    res.send("API for task-management is running");
});

export default app;