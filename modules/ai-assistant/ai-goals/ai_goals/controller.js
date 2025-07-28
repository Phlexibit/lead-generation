require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const AIGoal = require("./models");
const AIGoalAssignment = require("../ai_goal_assignment/models");
const { canAssignTo, getNextLowerRoleUser } = require("../../../../lib/helpers");
const AITask = require("../../ai-tasks/ai_task/models");
const AITaskAssignment = require("../../ai-tasks/ai_task_assignment/models");

const Goal = require("../../../goals/goals/models");
const GoalAssignment = require("../../../goals/goal_assignment/models");

const Task = require("../../../tasks/task/models");
const TaskAssignment = require("../../../tasks/task_assignment/models");

const getGoals = async (req, res) => {
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

    if (req.query.id) {
      filter.$or = [{ _id: req.query.id }];
    }

    if (req.query.due_date_from || req.query.due_date_to) {
      filter.due_date = {};
      if (req.query.due_date_from)
        filter.due_date.$gte = new Date(req.query.due_date_from);
      if (req.query.due_date_to)
        filter.due_date.$lte = new Date(req.query.due_date_to);
    }

    const goals = await AIGoal.find(filter)
      .populate("created_by", "username first_name last_name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const goalsWithTasks = await Promise.all(
      goals.map(async (goal) => {
        try {
          // First fetch tasks
          const tasks = await AITask.find({ goal: goal._id })
            .populate("created_by", "username first_name last_name email")
            .select("title description status priority due_date created_by");

          const tasksWithAssignments = await Promise.all(
            tasks.map(async (task) => {
              try {
                const taskAssignment = await AITaskAssignment.findOne({
                  task: task._id,
                })
                  .populate(
                    "assigned_by",
                    "username first_name last_name email"
                  )
                  .populate(
                    "assigned_to",
                    "username first_name last_name email"
                  );

                const taskObj = task.toObject();
                taskObj.assignment = taskAssignment;
                return taskObj;
              } catch (assignmentError) {
                console.error(
                  `Error fetching assignment for task ${task._id}:`,
                  assignmentError
                );
                const taskObj = task.toObject();
                taskObj.assignment = null;
                return taskObj;
              }
            })
          );
          const goalObj = goal.toObject();
          goalObj.tasks = tasksWithAssignments;
          return goalObj;
        } catch (taskError) {
          console.error(
            `Error fetching tasks for goal ${goal._id}:`,
            taskError
          );
          const goalObj = goal.toObject();
          goalObj.tasks = [];
          return goalObj;
        }
      })
    );

    const total = await AIGoal.countDocuments(filter);

    res.json({
      success: true,
      data: {
        goals: goalsWithTasks,
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
      message: "Error fetching goals",
      error: error.message,
    });
  }
};

const createGoal = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      due_date,
      tags,
      assigned_to,
      tasks = [],
    } = req.body.goal;
    const created_by = req.user.id;
    const created_by_role = req.user.role;

    let assignee = assigned_to;
    if (!assignee) {
      assignee = await getNextLowerRoleUser(created_by_role);
      if (!assignee) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "No suitable user found to assign the goal to",
        });
      }
    } else {
      const canAssign = await canAssignTo(created_by_role, assignee);
      if (!canAssign) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "You do not have permission to assign goals to this user",
        });
      }
    }

    const goal = new AIGoal({
      title,
      description,
      priority,
      due_date,
      created_by,
      tags,
    });

    const newGoal = await goal.save();

    const goalAssignment = new AIGoalAssignment({
      goal: newGoal.id,
      assigned_by: created_by,
      assigned_to: assignee,
    });

    const savedGoalAssignment = await goalAssignment.save();

     const createdTasks = await Promise.all(
      tasks.map(async (task) => {
        // Create task
        const newTask = new AITask({
          title: task.title,
          description: task.description,
          priority: task.priority,
          due_date: task.due_date,
          created_by: created_by,
          goal: newGoal._id,
          tags: task.tags
        });

        const savedTask = await newTask.save();

        // Create task assignment
        const taskAssignment = new AITaskAssignment({
          task: savedTask._id,
          assigned_by: created_by,
          assigned_to: task.assignedTo
        });

        const savedTaskAssignment = await taskAssignment.save();

        return {
          task: savedTask,
          assignment: savedTaskAssignment
        };
      })
    );

    await savedGoalAssignment.populate([
      {
        path: "assigned_by",
        select: "username first_name last_name email",
        // populate: { path: "role", select: "name" },
      },
      {
        path: "assigned_to",
        select: "username first_name last_name email",
        // populate: { path: "role", select: "name" },
      },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "AIGoal created successfully",
      data: {
        goal,
        goalAssignment: savedGoalAssignment,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error creating goal",
      error: error.message,
    });
  }
};

const approveAIGoal = async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      due_date,
      tags,
      assigned_to,
      tasks = [],
    } = req.body.goal;
    const created_by = req.user.id;
    const created_by_role = req.user.role;

    let assignee = assigned_to;
    if (!assignee) {
      assignee = await getNextLowerRoleUser(created_by_role);
      if (!assignee) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "No suitable user found to assign the goal to",
        });
      }
    } else {
      const canAssign = await canAssignTo(created_by_role, assignee);
      if (!canAssign) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "You do not have permission to assign goals to this user",
        });
      }
    }

    const goal = new Goal({
      title,
      description,
      priority,
      due_date,
      created_by,
      tags,
    });

    const newGoal = await goal.save();

    const goalAssignment = new GoalAssignment({
      goal: newGoal.id,
      assigned_by: created_by,
      assigned_to: assignee,
    });

    const savedGoalAssignment = await goalAssignment.save();

     const createdTasks = await Promise.all(
      tasks.map(async (task) => {
        // Create task
        const newTask = new Task({
          title: task.title,
          description: task.description,
          priority: task.priority,
          due_date: task.due_date,
          created_by: created_by,
          goal: newGoal._id,
          tags: task.tags
        });

        const savedTask = await newTask.save();

        // Create task assignment
        const taskAssignment = new TaskAssignment({
          task: savedTask._id,
          assigned_by: created_by,
          assigned_to: task?.assignment?.assigned_to
        });

        const savedTaskAssignment = await taskAssignment.save();

        return {
          task: savedTask,
          assignment: savedTaskAssignment
        };
      })
    );

    await savedGoalAssignment.populate([
      {
        path: "assigned_by",
        select: "username first_name last_name email",
        // populate: { path: "role", select: "name" },
      },
      {
        path: "assigned_to",
        select: "username first_name last_name email",
        // populate: { path: "role", select: "name" },
      },
    ]);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "AIGoal created successfully",
      data: {
        goal,
        goalAssignment: savedGoalAssignment,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error creating goal",
      error: error.message,
    });
  }
};

// Update goal
const updateGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    const updates = req.body;
    const userId = req.user.id;

    const goal = await AIGoal.findById(goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "AIGoal not found",
      });
    }

    if (updates.status === "completed" && goal.status !== "completed") {
      updates.completed_at = new Date();
    }

    const updatedGoal = await AIGoal.findByIdAndUpdate(goalId, updates, {
      new: true,
      runValidators: true,
    }).populate([
      { path: "created_by", select: "username first_name last_name email" },
      // { path: "assigned_to", select: "username first_name last_name email" },
      {
        path: "tasks",
        select: "title description status priority due_date",
        // populate: {
        //   path: "assigned_to",
        //   select: "username first_name last_name email",
        // },
      },
    ]);

    res.json({
      success: true,
      message: "AIGoal updated successfully",
      data: updatedGoal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating goal",
      error: error.message,
    });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goalId = req.params.id;
    const userId = req.user.id;

    const goal = await AIGoal.findById(goalId);
    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "AIGoal not found",
      });
    }

    // Delete associated goal assignments
    await AIGoalAssignment.deleteMany({ goal: goalId });
    await AIGoal.findByIdAndDelete(goalId);

    res.json({
      success: true,
      message: "AIGoal and associated assignments deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting goal",
      error: error.message,
    });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  approveAIGoal
};
