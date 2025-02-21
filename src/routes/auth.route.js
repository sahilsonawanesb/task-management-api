import express from 'express';
import {signUp, signIn, getCurrentUser,signOut} from '../controllers/auth.controller.js';
import {authenticate} from '../middlewares/auth.js';



// create the auth route
const router = express.Router();

// signUp and SignIn route
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
// created route for signout the user
router.post('/signout', signOut);

// user-details
router.get('/getUser', authenticate, getCurrentUser);



export default router;