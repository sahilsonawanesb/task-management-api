import {getUserNotification, markAsRead, markAllAsRead} from '../services/notificationservice.js';
import errorHandler from '../utils/error.js'
import Notification from '../models/notification.models.js';

export const getMyNotifications = async(req, res, next) => {
    try{
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required' });
          }
        const options = {
            limit : parseInt(req.query.limit) || 20,
            skip : parseInt(req.query.skip) || 0,
            unReadOnly : req.query.unread === 'true'
        }

        const notifications = await getUserNotification(req.user.id, options);
        const unreadCount = await getUnreadCount(req.user.id);

        res.status(200).json({
            count : notifications.count,
            unreadCount,
            notifications
        })
    }catch(error){
        next(error);
    }
}

export const getUnreadCount = async(userId) => {
    const count = await Notification.countDocuments({
        receipent : userId,
        isRead : false 
    });

    return count;
}

export const markNotificationAsRead = async(req, res, next) => {
    try{
        const {id} = req.params;

        const notification = await markAsRead(id, req.user.id);

        if(!notification){
            return errorHandler(404, 'Notification not found');
        }

        res.status(200).json({
            message : 'Notification mark as read',
            notification
        })
    }catch(error){
        next(error);
    }
}   

export const markAllNotificationAsRead = async(req,res, next) => {
    try{
        const count = await markAllAsRead(req.user.id);

        res.status(200).json({
            message : 'All notification mark as read',
            count
        })
    }catch(error){
        next(error);
    }
}

