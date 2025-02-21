import express from 'express';
import {signUp, signIn, getCurrentUser} from '../controllers/auth.controller.js';
import {authenticate} from '../middlewares/auth.js';
import {getUserLog} from '../controllers/task.controller.js';


// create the auth route
const router = express.Router();

// signUp and SignIn route
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);

// user-details
router.get('/getUser', authenticate, getCurrentUser);

// getUser actions logs
router.get('/:id/logs', authenticate, getUserLog)

export default router;