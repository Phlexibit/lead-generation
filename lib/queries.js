const AIGoal = require("../modules/ai-assistant/ai-goals/ai_goals/models");
const AITask = require("../modules/ai-assistant/ai-tasks/ai_task/models");
const AITaskAssignment = require("../modules/ai-assistant/ai-tasks/ai_task_assignment/models");

const getAIGoalAndTasks = async (filter) => {
  const goals = await AIGoal.find({
      session_id: filter.sessionId,
      created_by: filter.userId
    }).populate(
    "created_by",
    "username first_name last_name email"
  );

  console.log('goals from the function', goals)
  console.log('filter.sessionId', filter.sessionId)
  console.log('filter.userId', filter.userId)

  const goalsWithTasks = await Promise.all(
    goals.map(async (goal) => {
      try {
        const tasks = await AITask.find({ ai_goal: goal._id })
          .populate("created_by", "username first_name last_name email")
          .select("title description status priority due_date created_by");

        const tasksWithAssignments = await Promise.all(
          tasks.map(async (task) => {
            try {
              const taskAssignment = await AITaskAssignment.findOne({
                task: task._id,
              })
                .populate("assigned_by", "username first_name last_name email")
                .populate("assigned_to", "username first_name last_name email");

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
        console.error(`Error fetching tasks for goal ${goal._id}:`, taskError);
        const goalObj = goal.toObject();
        goalObj.tasks = [];
        return goalObj;
      }
    })
  );

  return goalsWithTasks;
};


const getLatestAIGoalWithTasks = async (filter) => {
  try {
    const latestGoal = await AIGoal.findOne({
      session_id: filter.sessionId,
      created_by: filter.userId,
    })
      .sort({ createdAt: -1 }) 
      .populate("created_by", "username first_name last_name email");

    if (!latestGoal) return null;

    const tasks = await AITask.find({ ai_goal: latestGoal._id })
      .populate("created_by", "username first_name last_name email")
      .select("title description status priority due_date created_by");

    const tasksWithAssignments = await Promise.all(
      tasks.map(async (task) => {
        try {
          const taskAssignment = await AITaskAssignment.findOne({
            ai_task: task._id,
          })
            .populate("assigned_by", "username first_name last_name email")
            .populate("assigned_to", "username first_name last_name email");

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

    const goalObj = latestGoal.toObject();
    goalObj.tasks = tasksWithAssignments;
    return goalObj;
  } catch (err) {
    console.error("Error fetching latest AI goal with tasks:", err);
    throw err;
  }
};


module.exports = {
  getAIGoalAndTasks,
  getLatestAIGoalWithTasks
};