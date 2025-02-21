import Task from '../models/tasks.models.js';
import {createNotification} from '../services/notificationservice.js'
import TaskLogService from '../services/taskLogService.js'



// controller function for creating task
export const createTask = async(req, res, next) => {
    try{

        if(req.user.role != 'admin'){
            return res.status(403).json({
                message : 'Only admins can create tasks'
            });
        }

        const {title, description,status, dueDate, assignedTo} = req.body;

        const task = new Task({
            title,
            description,
            dueDate,
            status : status || "Pending",
            assignedTo,
            createdBy : req.user.id
        })

        await task.save();

        if(assignedTo.toString() !== req.user.id.toString()){
            await createNotification(
                assignedTo,
                task._id,
                'task_assigned',
                `A new task "${title}" has been assigned to you by ${req.user.username}`
              );
        }
        res.status(201).json({
            message : "Task created successfully", task
        });

    }catch(error){
        res.status(500).json({
            message : "Error creating tasks",
            error : error.message
        })
    }
}

// only admin and assigned users can see their tasks
export const getTasks = async(req, res, next) => {

    try{

        let tasks;
        if(req.user.role === 'admin'){
            tasks = await Task.find()
            .populate("createdBy assignedTo", "username email")
        }else{
            tasks = await Task.find({
                assignedTo : req.user.id
            }).populate("createdBy", "username");
        }

        res.status(200).json(tasks);


    }catch(error){
        res.status(500).json({
            messgae:"Error Fetching tasks", 
            error : error.message
        })
    }
}

// controller function for updating the tasks
export const updateTasks = async(req, res, next) => {
    try{
        const {id} = req.params;
        const task = await Task.findById(id);

        if(!task){
            return res.status(404).json({message : 'Task not found'});
        }

        // now only admins can update the tasks.
        if(req.user.role !== "admin"){
            return res.status(404).json({message : 'Only admin can update tasks'})
        }

        const updateTask = await Task.findByIdAndUpdate(id, req.body, {new : true});

        if(updateTask.assignedTo && task.assignedTo.toString() !== updateTask.assignedTo.toString()){
            await createNotification(
                assignedTo,
                task._id,
                'task_assigned',
                 `Task "${task.title}" has been reassigned to you by ${req.user.username}`
            )
        }

        if (updateTask.title || updateTask.description || updateTask.dueDate) {
            await createNotification(
              task.assignedTo,
              task._id,
              'task_updated',
              `Task "${task.title}" has been updated by ${req.user.username}`
            );
          }

        res.status(200).json({
            message : "Task updated sucessfully",
            updateTask
        })


    }catch(error){
        res.status(500).json({
            message : 'Error updating tasks',
            error : error.message
        })
    }
}

// controller function for deleting the tasks
export const deleteTasks = async(req, res, next) => {
    // only admin can delete the tasks..
    try{
        const {id} = req.params;
    const task = await Task.findById(id);

    if(!task){
        return res.status(400).json({
            message : 'Task not found',
        })
    }

    if(req.user.role !== 'admin'){
        return res.status(400).json({message : 'Only Admins can delete the tasks'});
    }

    await task.deleteOne();
    res.status(200).json({
        messgae : 'Task delete successfully',

    })
    }catch(error){
        res.status(500).json({
            message : 'Error deleting message',
            error : error.message
        })
    }
    
}

// controller function for updating the status of the tasks
export const updateTaskStatus = async(req, res, next) => {
    try{
        const {id} = req.params;
        const {status} = req.body;
        const task = await Task.findById(id);

        if(!task){
            return res.status(400).json({message : 'Task not found'});
        }

        // console.log(task.assignedTo.toString());
        const userId = req.user.id.toString();

        // now only admin and users with assigned tasks can assigned update the status
        if(task.assignedTo.toString() !== userId && req.user.role !== 'admin'){
            return res.status(400).json({message : 'Not authorize to update the task status'});
        }

        task.status = status;
        await task.save();

        await createNotification(
            task.assignedTo,
            task._id,
            'status_change',
            `Task "${task.title}" status changed to "${status}" by ${req.user.username}`
          );

          console.log(`Task ${id} status updated to ${status} by user ${userId}`);

        res.status(200).json({message : 'Task status update successfull', task});
    }catch(error){
        res.status(400).json({
            message : 'Error in updating status',
            error : error.message
        })
    }

}

// controller function for getting the task..
export const getTaskLog = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Task ID is required" });
        }

        const logs = await TaskLogService.getTaskLogs(
            id,
            parseInt(req.query.limit) || 20,
            parseInt(req.query.skip) || 0
        );

        if (!logs.length) {
            return res.status(404).json({ message: "No logs found for this task" });
        }

        res.status(200).json({ logs });
    } catch (error) {
      
        res.status(500).json({ error: error.message });
    }
};

export const getUserLog = async(req, res, next) => {
    try{
        const {id} = req.params;
        console.log(id);
        if(!id){
            return res.status(400).json({error : 'User not found'});
        }

        const logs = await TaskLogService.getUserActionLogs(
            id,
            parseInt(req.query.limit) || 20,
            parseInt(req.query.skip) || 0,
        )

        if(!logs.length){
            return res.status(400).json({messgae : 'No logs foound for this user'});
        }

     res.status(200).json({logs})
     

    }catch(error){
        res.status(500).json({
            error : error.message
        })
    }
}


