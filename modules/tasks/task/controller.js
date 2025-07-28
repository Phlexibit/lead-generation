require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const Task = require("./models");
const TaskAssignment = require("../task_assignment/models");
const { canAssignTo } = require("../../../lib/helpers");

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

    const tasks = await Task.find(filter)
      .populate("created_by", "username first_name last_name email")
      .populate("assigned_to", "username first_name last_name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(filter);

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
      goalId
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

    const task = new Task({
      title,
      description,
      priority,
      due_date,
      created_by,
      tags,
      estimated_hours,
      goal: goalId
    });

    const newTask = await task.save();

    const taskAssignment = new TaskAssignment({
      task: newTask.id,
      assigned_by: created_by,
      assigned_to,
    });

    const savedTaskAssignment = await taskAssignment.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Task created successfully",
      data: {
        task
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
    const updates = req.body.task;
    const userId = req.user.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (updates.status === "completed" && task.status !== "completed") {
      updates.completed_at = new Date();
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
      new: true,
      runValidators: true,
    })
    // .populate([
    //   { path: "created_by", select: "username first_name last_name email" },
    //   { path: "assigned_to", select: "username first_name last_name email" },
    // ]);

    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
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

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await Task.findByIdAndDelete(taskId);

    res.json({
      success: true,
      message: "Task deleted successfully",
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
