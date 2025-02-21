import TaskLog from '../models/taskLogs.model.js';

export class TaskLogService {

  static async createLog(taskId, action, userId, previousState = null, newState = null, details = '') {
    try {
      const logEntry = new TaskLog({
        task: taskId,
        action,
        performedBy: userId,
        previousState,
        newState,
        details
      });
      
      return await logEntry.save();
    } catch (error) {
      console.error('Failed to create task log:', error);
      throw error;
    }
  }
  

  static async getTaskLogs(taskId, limit = 20, skip = 0) {
    try {
        const logs = await TaskLog.find({ task: taskId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('performedBy', 'username email')
            .exec();

        return logs;
    } catch (error) {
        console.error("Error fetching task logs:", error);
        throw new Error("Failed to fetch task logs");
    }
}
  

  static async getUserActionLogs(userId, limit = 20, skip = 0) {
    return TaskLog.find({ performedBy: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('task', 'title')
      .exec();
  }
}

export default TaskLogService;
