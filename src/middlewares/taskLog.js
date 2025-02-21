
import {TaskLogService} from '../services/taskLogService.js';
import Task from '../models/tasks.models.js';


export const logTaskAction = (action) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = async function(body) {

      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const taskId = req.params.id || (typeof body === 'string' ? JSON.parse(body)._id : body._id);
          const userId = req.user.id.toString();

          console.log(userId);

          if (action === 'updated' && req.originalTask) {
            await TaskLogService.createLog(
              taskId, 
              action,
              userId,
              req.originalTask,
              typeof body === 'string' ? JSON.parse(body) : body,
              req.details || ''
            );
          } else if (action === 'status_changed' && req.originalTask) {
            await TaskLogService.createLog(
              taskId,
              action,
              userId,
              { status: req.originalTask.status },
              { status: req.body.status },
              `Status changed from ${req.originalTask.status} to ${req.body.status}`
            );
          } else {
           
            await TaskLogService.createLog(
              taskId,
              action,
              userId,
              null,
              action === 'deleted' ? null : (typeof body === 'string' ? JSON.parse(body) : body),
              req.details || ''
            );
          }
        } catch (error) {
          console.error('Error in task logging middleware:', error);

        }
      }
      
      return originalSend.apply(res, arguments);
    };
    
    next();
  };
};


export const captureTaskState = async (req, res, next) => {
  try {
  
    if (req.params.id) {
      req.originalTask = await Task.findById(req.params.id).lean();
    }
    next();
  } catch (error) {
    next(error);
  }
};


export default {logTaskAction, captureTaskState}