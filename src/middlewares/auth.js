import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

// Authentication Middleware
export const authenticate = async (req, res, next) => {
  try {

    const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find User
    const user = await User.findById(decodedToken.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User not found or inactive" });
    }
    req.user = {
      id: user._id,
      role: user.role,
      username: user.username,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

// role based authorization middleware.
export const authorize = (...roles) => {
    return (req, res, next) => {
        if(!req.user){
            return res.status(401).json({message : 'Authenication required'});
        }

        if(!roles.includes(req.user.role)){
            return res.status(403).json({messgae : 'Access Denied: inSufficient Permisson'});
        }
        next();
    }


}

export const authorizeAdmin = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'You are not allowed to perform this action' });
  }

  next();
};

export default {authenticate, authorize, authorizeAdmin};