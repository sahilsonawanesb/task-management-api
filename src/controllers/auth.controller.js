import dotenv from 'dotenv';
dotenv.config(); 
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.models.js'
import errorHandler from '../utils/error.js';



// controller function for sign-up
export const signUp = async(req, res, next) => {
    const {username, email, password} = req.body;

    // validation 
    if(!username || !email || !password.trim()){
        return next(errorHandler(400, "All fields are required"));
    }

    // securing and hashing the password.
    const hashPassword = bcryptjs.hashSync(password, 10);

    try{
        // now create the new user as follows
        const newUser = new User({
            username : username,
            email : email,
            password : hashPassword
        });

        await newUser.save();
        res.json("Sign Up Sucessfull");

    }catch(error){
        next(error);
    }
}

// controller function for sign-in
export const signIn = async(req, res, next) => {
    const {email, password} = req.body;

    // first validate the feilds
    if(!email || !password || email.trim() === '' || password.trim() === ''){
        next(errorHandler(400, 'All feilds are required'));
    }

    try{
        // validate the user.
        const validUser = await User.findOne({email});
     
        if (!validUser) {
            return next(errorHandler(400, 'User not found'));
        }
      
        

        // validate the password
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid password'));
        }

        // JWT token
        const token = jwt.sign({id : validUser?._id, role : validUser.role}, process.env.JWT_SECRET);

        // seperation and hiding the password from the enduserl
        const {password : pass, ...rest} = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly : true
         }).json(rest);
    }catch(error){
        next(error);
    }
}

export default {signUp, signIn};


