import mongoose from "mongoose";

const TaskLogSchema = mongoose.Schema({
    task : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Task',
        required : true,
    },
    action : {
        type : String,
        enum : ["created", "updated", "deleted", "status_changed", "re-assigned"],
        required : true,
    },
    performedBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    previousState: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      },
      newState: {
        type: mongoose.Schema.Types.Mixed,
        default: null
      },
      details: {
        type: String,
        default: ''
      }

}, {timestamps : true});

TaskLogSchema.index({ task: 1, createdAt: -1 });
TaskLogSchema.index({ performedBy: 1, createdAt: -1 });

const TaskLog = mongoose.model('TaskLog', TaskLogSchema);
export default TaskLog;

