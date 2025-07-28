const ChatSession = require('./models');
const AIChat = require('../chats/models');
const { getLatestAIGoalWithTasks } = require('../../../lib/queries');

const getSessionList = async (req, res) => {
  try {
    const userId = req.user?.id;

    const sessions = await ChatSession.find({ user: userId }).sort({ createdAt: -1 }) ;

    if (!sessions) {
      return res.status(404).json({
        success: false,
        error: 'Chat session not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      sessions
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: 'Failed to get chat sessions',
    });
  }
};

const getChatSession = async (req, res) => {
  try {
    const sessionId = req.query?.id;
    const userId = req.user?.id;

    const session = await ChatSession.findOne({ _id: sessionId, user: userId });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: 'Chat session not found or unauthorized',
      });
    }

    const chats = await AIChat.find({ session: sessionId }).sort({ createdAt: 1 });

    const ai_goal = await getLatestAIGoalWithTasks({ sessionId, userId });

    res.status(200).json({
      success: true,
      session,
      chats,
      ai_goal
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: 'Failed to get chat session',
    });
  }
};

const createChatSession = async (req, res) => {
  try {
    const userId = req.user?.id;

    const { title } = req.body;

    const newSession = await ChatSession.create({
      user: userId,
      title: title || 'Untitled Chat'
    });

    res.status(201).json({
      success: true,
      data: newSession
    });

  } catch (error) {
    console.error('Create Chat Session Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create chat session'
    });
  }
};

module.exports = {
  createChatSession,
  getChatSession,
  getSessionList
};
