import express from 'express';
import {createTask, getTasks, updateTasks, deleteTasks, updateTaskStatus, getTaskLog} from '../controllers/task.controller.js';
import {authenticate, authorizeAdmin} from '../middlewares/auth.js';
import {logTaskAction, captureTaskState} from '../middlewares/taskLog.js';


// create the routes
const router = express.Router();
router.post('/create', authenticate, authorizeAdmin, logTaskAction('created'), createTask)
router.get('/getTask', authenticate, getTasks);
router.put('/updateTask/:id', authenticate,authorizeAdmin,captureTaskState,logTaskAction('updated'),updateTasks);
router.delete('/deleteTask/:id', authenticate,authorizeAdmin, captureTaskState,logTaskAction('deleted'), deleteTasks);
router.put('/:id/status', authenticate,captureTaskState,logTaskAction('status_changed'),updateTaskStatus);

// getTaskLog route
router.get('/:id/logs', authenticate, getTaskLog);


export default router;