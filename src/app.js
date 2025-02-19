import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';



// created app here..

const app = express();


// middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));


// API for testing.
app.get("/", (req, res) => {
    res.send("API for task-management is running");
});

export default app;