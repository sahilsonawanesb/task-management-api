import dotenv from 'dotenv';
dotenv.config(); 
import jwt from 'jsonwebtoken';


// setting the configuration for jwt
export const generateToken = (user) => {
    return jwt.sign(
        {id : user._id, role : user.role},
        process.env.JWT_SECRET,
    )
}

export const generateRefreshToken = (user) => {
    return jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
    );
  };
  

// verify token
export const verifyToken = (token) => {
    try{
        return jwt.verify(token, process.env.JWT_SECRET);
    }catch(error){  
        return null;
    }
}

export default {generateToken, generateRefreshToken, verifyToken};

