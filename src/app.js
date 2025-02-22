import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import AuthRoutes from './routes/auth.route.js';
import TaskRoutes from './routes/task.route.js';
import NotificationRoutes from './routes/notification.route.js';
import UserRoutes from './/routes/user.route.js';



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

// users route..
app.use('/api/user', UserRoutes);

// tasks routes..
app.use('/api/task', TaskRoutes);

// notification routes..
app.use('/api/notifications', NotificationRoutes);

// API for testing.
app.get("/", (req, res) => {
    res.send("API for task-management is running");
});

export default app;