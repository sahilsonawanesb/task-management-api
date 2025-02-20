import express from 'express';
import {createTask, getTasks, updateTasks, deleteTasks, updateTaskStatus} from '../controllers/task.controller.js';
import {authenticate, authorizeAdmin} from '../middlewares/auth.js';


// create the routes
const router = express.Router();
router.post('/create', authenticate, authorizeAdmin, createTask)
router.get('/getTask', authenticate, getTasks);
router.put('/updateTask/:id', authenticate,authorizeAdmin,updateTasks);
router.delete('/deleteTask/:id', authenticate,authorizeAdmin, deleteTasks);
router.put('/:id/status', authenticate,updateTaskStatus);

export default router;