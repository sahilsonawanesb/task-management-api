import express from 'express';
import {createTask, getTasks, updateTasks, deleteTasks, updateTaskStatus} from '../controllers/task.controller.js';
import auth, {authenticate} from '../middlewares/auth.js';


// create the routes
const router = express.Router();
router.post('/create', authenticate, createTask)
router.get('/getTask', authenticate, getTasks);
router.put('/updateTask/:id', authenticate, updateTasks);
router.delete('/deleteTask/:id', authenticate, deleteTasks);
router.put('/:id/status', authenticate,updateTaskStatus);

export default router;