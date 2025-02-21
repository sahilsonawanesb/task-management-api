import User from '../models/user.models.js';
import bcryptjs from 'bcryptjs';


// controller function for getting all users
export const getUsers = async(req, res, next) => {
    try{
        if(req.user.role !== 'admin'){
            return res.status(400).json({error : 'You are not allowed to see all users'});
        }

        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = parseInt(req.query.sort === 'asc' ? 1 : -1);

        const users = await User.find()
            .sort({createdAt:sortDirection})
            .skip(startIndex)
            .limit(limit)

        const usersWithoutPassword = users.map((user) => {
            const {password, ...rest} = user._doc;
            return rest;
        })

        const totalUsers = await User.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth()-1,
            now.getDay()
        )

        const lastMonthUsers = await User.countDocuments({
            createdAt : {
                $gte : oneMonthAgo
            }
        })

        res.status(200).json({
            users:usersWithoutPassword,
            totalUsers,
            lastMonthUsers
        })
    }catch(error){
        res.status(500).json({error : error.message})
    }
   


}

// controller function for getting user by Id
export const getUser = async(req, res, next) => {
    try{
        const {id} = req.params;
        if(!id){
            res.status(400).json({error : 'User not found'});
        }

        const user = await User.findById(id);

        const {password, ...rest} = user._doc;

        res.status(200).json(rest);

    }catch(error){
        res.status(500).json({error:error.message});
    }
}

// controller function for updating user info
export const updateUser = async(req, res, next) => {
    try{
        const {id} = req.params;
       

        if(req.user.id.toString() !== id){
            return res.status(400).json({error : 'You are not allowed to update information'});
        }

        if(req.body.password){
            if(req.body.password.length < 6){
                return res.status(400).json({error : 'Password must be at least 6 characters'});
            }
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updateUser = await User.findByIdAndUpdate(id, {
            $set : {
                username : req.body.username,
                email : req.body.email,
                password : req.body.password
            }
        }, {new : true});

        const {password, ...rest} = updateUser._doc;
        res.status(200).json(rest);
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

// controller function for deleteing user
export const deleteUser = async(req, res, next) => {
    try{
        const {id} = req.params;
       
        await User.findByIdAndDelete(id);
        res.status(200).json('User Deleted Successfully');
    }catch(error){
        res.status(400).json({error : error.message});
    }
}





