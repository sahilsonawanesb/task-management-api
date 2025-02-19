import express from 'express';
import {signUp, signIn} from '../controllers/auth.controller.js';


// create the auth route
const router = express.Router();

// signUp and SignIn route
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);

export default router;