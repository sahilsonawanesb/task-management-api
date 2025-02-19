import mongoose from "mongoose";

// create the user schema here..

const UserSchema = new mongoose.Schema({
    username:{
        type : String,
        required : [true, "Username is required"],
        unique : true
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true
    },
    password : {
        type : String,
        required : [true, "Password is Required"]
    },
    role : {
        type : String,
        enum : ['Admin', 'User'],
        default : 'User'
    }
}, {timestamps:true});


const User = mongoose.model('User', UserSchema);

export default User