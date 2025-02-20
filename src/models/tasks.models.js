import mongoose, { mongo } from "mongoose";


const TaskSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim: true,
        minlength : 3,
        maxlength : 100
    }, 
    description : {
        type : String,
        required : true,
        trim : true,
        maxlength : 1000
    },
    status : {
        type : String,
        enum : ['Pending', 'In Progress', 'Completed'],
        default : 'Pending'
    },
    dueDate : {
        type : Date,
        required : true
    },
    assignedTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    isDeleted : {
        type : Boolean,
        default : false,
    }
}, {
    timestamps : true
})

const Task = mongoose.model('Task', TaskSchema);
export default Task;
