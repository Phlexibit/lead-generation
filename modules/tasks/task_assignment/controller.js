require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const Task = require("../task/models");
const TaskAssignment = require("./models");
const { canAssignTo } = require("../../../lib/helpers");

const createAssignment = async (req, res) => {
  try {
    const { task_id, assigned_to } = req.body;

    const assigned_by = req.user.id;

    const created_by_role = req.user.role;

    const canAssign = await canAssignTo(created_by_role, assigned_to);

    if (!canAssign) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You do not have permission to assign tasks to this user",
      });
    }

    // Check if task exists
    const task = await Task.findById(task_id);

    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Task not found",
      });
    }

    const existingAssignment = await TaskAssignment.findOne({
      task: task_id
    });

    if(existingAssignment){ 
        await existingAssignment.deleteOne();
    }

    const taskAssignment = new TaskAssignment({
      task: task_id,
      assigned_by,
      assigned_to,
    });

    const assignment = await taskAssignment.save();

    await assignment.populate([
      { path: "task", select: "title description priority due_date status" },
      { path: "assigned_by", select: "username first_name last_name email" },
      { path: "assigned_to", select: "username first_name last_name email" },
    ]);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error creating assignment",
      error: error.message,
    });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const { assignment_id, task_id } = req.body;

    // Check if task exists
    const task = await Task.findById(task_id);
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Task not found",
      });
    }

    const taskAssignment = await TaskAssignment.findById(assignment_id);

    if (!taskAssignment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No assignment found !",
      });
    }

    await taskAssignment.deleteOne();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Task Assignment removed successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error removing assignment",
      error: error.message,
    });
  }
};

module.exports = {
  createAssignment,
  deleteAssignment,
};
