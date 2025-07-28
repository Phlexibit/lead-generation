require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const AIGoal = require("../ai_goals/models");
const AIGoalAssignment = require("./models");
const { canAssignTo } = require("../../../../lib/helpers");

const createAssignment = async (req, res) => {
  try {
    const { goal_id, assigned_to } = req.body;

    const assigned_by = req.user.id;
    
    const created_by_role = req.user.role;

    const canAssign = await canAssignTo(created_by_role, assigned_to);

    if (!canAssign) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "You do not have permission to assign goals to this user",
      });
    }

    // Check if goal exists
    const goal = await AIGoal.findById(goal_id);

    if (!goal) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "AIGoal not found",
      });
    }

    const goalAssignment = new AIGoalAssignment({
      goal: goal_id,
      assigned_by,
      assigned_to,
    });

    const savedAssignment = await goalAssignment.save();

    await savedAssignment.populate([
      { 
        path: "goal", 
        select: "title description priority due_date status tasks",
        populate: {
          path: "tasks",
          select: "title status"
        }
      },
      { path: "assigned_by", select: "username first_name last_name email" },
      { path: "assigned_to", select: "username first_name last_name email" },
    ]);

    res.status(StatusCodes.CREATED).json({
      success: true,      message: "AIGoal Assignment created successfully",
      data: savedAssignment,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error creating goal assignment",
      error: error.message,
    });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const { assignment_id, goal_id } = req.body;

    // Check if goal exists
    const goal = await AIGoal.findById(goal_id);
    if (!goal) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "AIGoal not found",
      });
    }

    const goalAssignment = await AIGoalAssignment.findById(assignment_id);

    if (!goalAssignment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "No goal assignment found!",
      });
    }

    await goalAssignment.deleteOne();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "AIGoal Assignment removed successfully",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error removing goal assignment",
      error: error.message,
    });
  }
};

module.exports = {
  createAssignment,
  deleteAssignment,
};
