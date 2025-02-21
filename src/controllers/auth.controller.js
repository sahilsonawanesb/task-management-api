import dotenv from 'dotenv';
dotenv.config(); 
import bcryptjs from 'bcryptjs';
// import jwt from 'jsonwebtoken';
import User from '../models/user.models.js'
import errorHandler from '../utils/error.js';
import {generateToken, generateRefreshToken} from '../config/jwt.js';


// controller function for sign-up
export const signUp = async(req, res, next) => {
    try{
    const {username, email, password, role} = req.body;

    // validation 
    if(!username || !email || !password.trim()){
        return next(errorHandler(400, "All fields are required"));
    }
     // Check if user already exists
     const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });

      if(existingUser){
        if(existingUser.email === email){
          return next(errorHandler(409, 'Email already in use'));
        }
        if(existingUser.username === username){
          return next(errorHandler(409, 'Username already taken'));
        }
      }

    // securing and hashing the password.
    const hashPassword = bcryptjs.hashSync(password, 10);

  
        // now create the new user as follows
        const user = new User({
            username : username,
            email : email,
            password : hashPassword,
            role: role || 'user'
        });

        await user.save();

        // generate tokens;
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);


        res.status(201).json({
            message : 'User Register Successfully',
            token,
            refreshToken,
            user : {
                id : user._id,
                username : user.username,
                email : user.email,
                role: user.role
            }

        })

    }catch(error){
        next(error);
    }
}

// controller function for sign-In
export const signIn = async(req, res, next) => {
    try{
        const {email, password} = req.body;

        // first validate the fields
        if(!email || !password || email.trim() === '' || password.trim() === ''){
            return next(errorHandler(400, 'All fields are required'));
        }

        // validate the user
        const validUser = await User.findOne({email});
     
        if (!validUser) {
            return next(errorHandler(400, 'User not found'));
        }
      
        // validate the password
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid password'));
        }

        // Generate tokens
        const token = generateToken(validUser);
        const refreshToken = generateRefreshToken(validUser);

        // Hide password from response
        const {password: pass, ...rest} = validUser._doc;

        // Set cookies first
        res.cookie('access_token', token, {
            httpOnly: true
        });
        
        res.cookie('refresh_token', refreshToken, {
            httpOnly: true
        });

        // Then send a single response
        return res.status(200).json({
            message: 'Login Successful',
            ...rest
        });
    } catch(error) {
        next(error);
    }
}

// controller function for signout
export const signOut = async(req, res, next) => {
    try{
        res.clearCookie('access_token').status(200).json("User has been sign-out");
    }catch(error){
        res.status(500).json({error : error.message});
    }
}


// controller function for getting current user details
export const getCurrentUser = async(req, res, next) => {
    try{

        const user = await User.findById(req.user.id);

        res.status(200).json({
            user : {
                id : user._id,
                username : user.username,
                email : user.email,
                role : user.role,
                createdAt : user.createdAt,
                updatedAt : user.updateAt
            }
        });

    }catch(error){
        next(error);
    }
}
export default {signUp, signIn, getCurrentUser, signOut};


