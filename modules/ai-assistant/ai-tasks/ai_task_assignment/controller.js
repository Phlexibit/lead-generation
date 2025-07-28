require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const AITask = require("../ai_task/models");
const AITaskAssignment = require("./models");
const { canAssignTo } = require("../../../../lib/helpers");

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
    const task = await AITask.findById(task_id);

    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "AITask not found",
      });
    }

    const existingAssignment = await AITaskAssignment.findOne({
      ai_task: task_id
    });

    if(existingAssignment){ 
        await existingAssignment.deleteOne();
    }

    const taskAssignment = new AITaskAssignment({
      ai_task: task_id,
      assigned_by,
      assigned_to,
    });

    const assignment = await taskAssignment.save();

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
    const task = await AITask.findById(task_id);
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "AITask not found",
      });
    }

    const taskAssignment = await AITaskAssignment.findById(assignment_id);

    if (!taskAssignment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No assignment found !",
      });
    }

    await taskAssignment.deleteOne();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "AITask Assignment removed successfully",
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
