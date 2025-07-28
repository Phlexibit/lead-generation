// controllers/chatController.js
const aiService = require("../../../services/aiService");
const User = require("../../user/models");
const Goal = require("../../goals/goals/models");
const Task = require("../../tasks/task/models");
const AIChat = require("../chats/models");
const AIGoal = require("../ai-goals/ai_goals/models");
const { getLatestAIGoalWithTasks } = require("../../../lib/queries");

const processMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user?.id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User authentication required",
      });
    }

    const { aiMessage, timestamp, actionItems } =
      await aiService.processUserMessage(message, userId, sessionId);

    await AIChat.create({
      user: userId,
      userMessage: message,
      aiMessage,
      session: sessionId,
      timestamp,
    });

    // const ai_goal = await getLatestAIGoalWithTasks({ sessionId, userId });

    // const chatHistory = await AIChat.find({
    //   user: userId,
    //   session: sessionId,
    // }).select("userMessage aiMessage timestamp session");

    res.json({
      success: true,
      message: "Message Created Successfully !"
      // data: {
        // chatHistory,
        // ai_goal
      // },
    });
  } catch (error) {
    console.error("Chat processing error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process message",
    });
  }
};

const handleAutoDelegation = async (userId, message) => {
  try {
    const pendingGoals = await Goal.find({
      created_by: userId,
      status: "pending",
    });

    const pendingTasks = await Task.find({
      created_by: userId,
      status: "pending",
    });

    const actionItems = [];

    for (const goal of pendingGoals) {
      const assignment = await aiService.assignGoalToTeamMember(
        goal._id,
        userId
      );
      if (assignment) actionItems.push(assignment);
    }

    for (const task of pendingTasks) {
      const assignment = await aiService.assignTaskToTeamMember(
        task._id,
        userId
      );
      if (assignment) actionItems.push(assignment);
    }

    return {
      aiMessage: `I've auto-delegated ${actionItems.length} pending items to your team members!`,
      actionItems,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error("Auto-delegation error:", error);
    return {
      aiMessage: "Failed to auto-delegate tasks. Please try again later.",
      actionItems: [],
      timestamp: new Date(),
    };
  }
};

const autoDelegate = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { context } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User authentication required",
      });
    }

    const delegationMessage =
      context ||
      "Please analyze my current workload and suggest optimal task delegations";
    const aiResult = await aiService.processUserMessage(
      delegationMessage,
      userId
    );

    res.json({
      success: true,
      data: {
        suggestions: aiResult.actionItems,
        aiResponse: aiResult.aiMessage,
        timestamp: aiResult.timestamp,
      },
    });
  } catch (error) {
    console.error("Auto-delegation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process delegation",
    });
  }
};

// const saveChatHistory = async (userId, userMessage, aiMessage) => {
//   try {
//     await ChatHistory.create({ user: userId, userMessage, aiMessage });
//     console.log(`Saving chat history:`, { userId, userMessage, aiMessage });
//   } catch (error) {
//     console.error("Failed to save chat history:", error);
//   }
// };

module.exports = {
  processMessage,
  autoDelegate,
};
