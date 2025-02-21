import mongoose from "mongoose";

const NotificationSchema = mongoose.Schema({
    receipent : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    type : {
        type : String,
        enum : ['task_assigned', 'task_updated', 'due_date_approaching', 'status_change'],
        required : true
    },
    task : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Task',
        required : true
    },
    message : {
        type : String,
        required : true
    },
    isRead : {
        type : Boolean,
        default : false
    }

}, {timestamps : true});

NotificationSchema.index({ receipent: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', NotificationSchema);

export default Notification;