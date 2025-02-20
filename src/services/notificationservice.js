import Notification from "../models/notification.models.js";
import Task from '../models/tasks.models.js';


export const createNotification = async(receipentId, taskId, type, message) => {

    try{

        const notification = new Notification({
            receipent : receipentId,
            task : taskId,
            type,
            message
        })

        await notification.save();
        return notification;
    }catch(error){
        throw error;
    }
}

export const getUserNotification = async(userId, opt = {}) => {
    try{
        const {limit = 20, skip = 0, unReadOnly = false} = opt;

        const query = {
            receipent : userId,
        }

        if(unReadOnly){
            query.isRead = false;
        }

        const notifications = await Notification.find(query)
        .sort({createdAt : -1})
        .skip(skip)
        .limit(limit)
        .populate({
            path : 'task',
            select : 'title status dueDate'
        })

        return notifications;
    }catch(error){
        throw error;
    }
    
}

export const markAsRead = async(notificationId, userId) => {
    try{
        const notification = await Notification.findOneAndUpdate(
            {_id : notificationId, receipent : userId},
            {isRead : true},
            {new : true}
        )
        return notification;
    }catch(error){
        throw error;    
    }
}

export const markAllAsRead = async (userId) => {
    try {
      const result = await Notification.updateMany(
        { receipent: userId, isRead: false },
        { $set: { isRead: true } } 
      );
      
      return result.modifiedCount;
    } catch (error) {
      logger.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  export const checkDueDates = async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 59, 999);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Find tasks that are due tomorrow
      const tasks = await Task.find({
        dueDate: { $gte: today, $lte: tomorrow },
        status: { $ne: 'Completed' },
        isDeleted: false
      }).populate('assignee', '_id');
      
      // Create notifications for tasks due tomorrow
      for (const task of tasks) {
        await createNotification(
          task.assignee._id,
          task._id,
          'due_date_approaching',
          `Task "${task.title}" is due tomorrow. Please complete it soon.`
        );
        
        logger.info(`Due date notification created for task: ${task._id}`);
      }
      
      return tasks.length;
    } catch (error) {
      logger.error('Error checking due dates:', error);
      throw error;
    }
  };

export default {createNotification, getUserNotification, markAsRead, markAllAsRead, checkDueDates};

