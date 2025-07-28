require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const AITask = require("./models");
const AITaskAssignment = require("../ai_task_assignment/models");
const { canAssignTo } = require("../../../../lib/helpers");

const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Apply filters
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assigned_to) filter.assigned_to = req.query.assigned_to;
    if (req.query.created_by) filter.created_by = req.query.created_by;

    if (req.query.userId) {
      filter.$or = [{ created_by: req.query.userId }];
    }

    if (req.query.due_date_from || req.query.due_date_to) {
      filter.due_date = {};
      if (req.query.due_date_from)
        filter.due_date.$gte = new Date(req.query.due_date_from);
      if (req.query.due_date_to)
        filter.due_date.$lte = new Date(req.query.due_date_to);
    }

    const tasks = await AITask.find(filter)
      .populate("created_by", "username first_name last_name email")
      .populate("assigned_to", "username first_name last_name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AITask.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          current_page: page,
          total_pages: Math.ceil(total / limit),
          total_items: total,
          items_per_page: limit,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      due_date,
      tags,
      assigned_to,
      estimated_hours,
      goalId,
    } = req.body.task;

    const created_by = req.user.id;
    const created_by_role = req.user.role;

    const canAssign = await canAssignTo(created_by_role, assigned_to);

    if (!canAssign) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You do not have permission to assign tasks to this user",
      });
    }

    const task = new AITask({
      title,
      description,
      priority,
      due_date,
      created_by,
      tags,
      estimated_hours,
      goal: goalId,
    });

    const newTask = await task.save();

    const taskAssignment = new AITaskAssignment({
      task: newTask.id,
      assigned_by: created_by,
      assigned_to,
    });

    const savedTaskAssignment = await taskAssignment.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "AITask created successfully",
      data: {
        task,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error creating task",
      error: error.message,
    });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;
    const { title, description, priority, status, due_date, assignedTo } =
      req.body.task;
    const created_by_role = req.user.role;

    if (assignedTo) {
      const canAssign = await canAssignTo(created_by_role, assignedTo?._id);
      if (!canAssign) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "You do not have permission to assign tasks to this user",
        });
      }
    }

    const task = await AITask.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "AITask not found",
      });
    }

    let completed_at = null;

    if (status === "completed" && status !== "completed") {
      completed_at = new Date();
    }

    const updatedTask = await AITask.findByIdAndUpdate(
      taskId,
      {
        title,
        description,
        priority,
        status,
        due_date,
        completed_at,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (assignedTo) {
      const existingAssignment = await AITaskAssignment.findOne({
        ai_task: taskId,
      });

      if (existingAssignment) {
        await AITaskAssignment.deleteMany({ ai_task: taskId });
      }

      const taskAssignment = new AITaskAssignment({
        ai_task: taskId,
        assigned_by: userId,
        assigned_to: assignedTo,
      });

      const savedTaskAssignment = await taskAssignment.save();

      console.log("savedTaskAssignment", savedTaskAssignment);
      console.log("updatedTask", updatedTask);
    }

    res.json({
      success: true,
      message: "AITask updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const userId = req.user.id;

    const task = await AITask.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "AITask not found",
      });
    }

    await AITask.findByIdAndDelete(taskId);

    res.json({
      success: true,
      message: "AITask deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: error.message,
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
