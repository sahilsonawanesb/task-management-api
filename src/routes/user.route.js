import express from 'express';
import { authenticate, authorizeAdmin } from '../middlewares/auth.js';
import {getUsers, getUser, updateUser, deleteUser} from '../controllers/user.controller.js';
import {getUserLog} from '../controllers/task.controller.js';

const router = express.Router();

// users api
router.get('/getUsers', authenticate,authorizeAdmin,getUsers);
router.get('/:id', authenticate, getUser);
router.put('/update/:id', authenticate, updateUser);
router.delete('/delete/:id', authenticate, authorizeAdmin, deleteUser);



// getUser actions logs
router.get('/:id/logs', authenticate, getUserLog)

export default router;