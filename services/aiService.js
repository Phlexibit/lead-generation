// services/aiService.js
const AIGoalAssignment = require('../modules/ai-assistant/ai-goals/ai_goal_assignment/models');
const AITaskAssignment = require('../modules/ai-assistant/ai-tasks/ai_task_assignment/models');
const AIGoal = require("../modules/ai-assistant/ai-goals/ai_goals/models");
const AITask = require("../modules/ai-assistant/ai-tasks/ai_task/models");
const User = require("../modules/user/models");

class AIService {
  constructor() {
    // Configuration for future AI integration
    this.config = {
      apiKey: process.env.OPENAI_API_KEY || null,
      model: process.env.AI_MODEL || 'gpt-4o',
      maxTokens: 1000,
      temperature: 0.7
    };
    
    // Dummy data for simulation
    this.dummyGoals = [
      { title: "Launch Marketing Campaign", description: "Create and execute a comprehensive marketing campaign for Q2", priority: "high" },
      { title: "Improve Customer Support", description: "Enhance customer support processes and response times", priority: "medium" },
      { title: "Website Redesign", description: "Complete redesign of company website with modern UI/UX", priority: "high" },
      { title: "Team Training Program", description: "Implement comprehensive training program for new employees", priority: "medium" }
    ];
    
    this.dummyTasks = [
      { title: "Create social media content", description: "Design posts for Facebook, Instagram, and LinkedIn", priority: "high" },
      { title: "Set up analytics tracking", description: "Implement Google Analytics and conversion tracking", priority: "medium" },
      { title: "Conduct market research", description: "Research competitor strategies and market trends", priority: "medium" },
      { title: "Design email templates", description: "Create responsive email templates for campaigns", priority: "low" }
    ];
  }

  // Main AI chat processing method
  async processUserMessage(message, userId, session_id) {
    try {
      const aiResponse = await this.generateAIResponse(message, userId);
      const actionItems = await this.extractActionItems(aiResponse, userId, session_id);
      return {
        aiMessage: aiResponse.message,
        actionItems: actionItems,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      throw new Error('Failed to process AI request');
    }
  }

  // Dummy AI response generator (replace with real AI API call)
  async generateAIResponse(userMessage, userId) {
    
    console.log('userMessage', userMessage)
    
    // Simple keyword-based response logic for demo
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('goal') || lowerMessage.includes('project')) {
      return {
        message: "I understand you want to work on a new goal. Let me break this down into manageable tasks and assign them to your team members. I'll create a goal with related tasks and delegate them appropriately.",
        intent: 'create_goal',
        entities: this.extractEntities(userMessage)
      };
    } else if (lowerMessage.includes('task') || lowerMessage.includes('todo')) {
      return {
        message: "I'll help you create and assign tasks. Let me analyze what needs to be done and who would be best suited for each task.",
        intent: 'create_task',
        entities: this.extractEntities(userMessage)
      };
    } else if (lowerMessage.includes('assign') || lowerMessage.includes('delegate')) {
      return {
        message: "I'll help you delegate this work to the right team members based on their skills and current workload.",
        intent: 'assign_work',
        entities: this.extractEntities(userMessage)
      };
    } else {
      return {
        message: "I'm here to help you organize your work into goals and tasks, then delegate them to your team. What would you like to accomplish?",
        intent: 'general',
        entities: {}
      };
    }
  }

  // Extract entities from user message (dummy implementation)
  extractEntities(message) {
    const entities = {};
    
    // Simple regex-based entity extraction for demo
    const priorityMatch = message.match(/\b(urgent|high|medium|low)\s+priority\b/i);
    if (priorityMatch) {
      entities.priority = priorityMatch[1].toLowerCase();
    }
    
    const dueDateMatch = message.match(/\b(today|tomorrow|next week|this week|next month)\b/i);
    if (dueDateMatch) {
      entities.dueDate = this.parseDueDate(dueDateMatch[1]);
    }
    
    return entities;
  }

  // Process AI response and create actual database entries
  async extractActionItems(aiResponse, userId, session_id) {
    const actionItems = [];
    
    try {
      if (aiResponse.intent === 'create_goal') {
        const goalData = await this.createGoalFromAI(aiResponse, userId, session_id);
        actionItems.push(goalData);
      } else if (aiResponse.intent === 'create_task') {
        const taskData = await this.createTaskFromAI(aiResponse, userId, session_id);
        actionItems.push(taskData);
      } else if (aiResponse.intent === 'assign_work') {
        const assignmentData = await this.createAssignmentsFromAI(aiResponse, userId, session_id);
        actionItems.push(assignmentData);
      }
    } catch (error) {
      console.error('Error creating action items:', error);
    }
    
    return actionItems;
  }

  // Create goal based on AI analysis
  async createGoalFromAI(aiResponse, userId, session_id) {
    const goalTemplate = this.getRandomItem(this.dummyGoals);
        console.log('session_id from goals', session_id)

    const goalData = {
      title: goalTemplate.title,
      description: goalTemplate.description,
      priority: aiResponse.entities.priority || goalTemplate.priority,
      due_date: aiResponse.entities.dueDate || this.getRandomFutureDate(),
      created_by: userId,
      status: 'pending',
      session_id
    };
    
    const goal = new AIGoal(goalData);
    await goal.save();
    
    // Create related tasks
    const tasks = await this.createTasksForGoal(goal._id, userId, session_id);
    
    // Assign goal and tasks to team members
    await this.assignGoalAndTasks(goal._id, tasks, userId, session_id);
    
    return {
      type: 'goal_created',
      goal: goal,
      tasks: tasks,
      message: `Created goal "${goal.title}" with ${tasks.length} tasks and assigned to team members.`
    };
  }

  // Create task based on AI analysis
  async createTaskFromAI(aiResponse, userId, session_id) {
    const taskTemplate = this.getRandomItem(this.dummyTasks);

    console.log('session_id', session_id)
    
    const dummyGoal = new AIGoal({
      title: "AI Generated AIGoal",
      description: "Auto-generated goal for task organization",
      created_by: userId,
      priority: 'medium',
      session_id
    });

    await dummyGoal.save();
    
    const taskData = {
      title: taskTemplate.title,
      description: taskTemplate.description,
      priority: aiResponse.entities.priority || taskTemplate.priority,
      due_date: aiResponse.entities.dueDate || this.getRandomFutureDate(),
      created_by: userId,
      ai_goal: dummyGoal._id,
      status: 'pending',
      session_id
    };
    
    const task = new AITask(taskData);
    await task.save();
    
    await this.assignTaskToTeamMember(task._id, userId, session_id);
    
    return {
      type: 'task_created',
      task: task,
      message: `Created task "${task.title}" and assigned to a team member.`
    };
  }

  // Create assignments based on AI analysis
  async createAssignmentsFromAI(aiResponse, userId, session_id) {
    // Find unassigned goals and tasks
    const unassignedGoals = await AIGoal.find({ created_by: userId }).limit(2);
    const unassignedTasks = await AITask.find({ created_by: userId }).limit(3);
    
    const assignments = [];
    
    // Assign goals
    for (const goal of unassignedGoals) {
      const assignment = await this.assignGoalToTeamMember(goal._id, userId, session_id);
      assignments.push(assignment);
    }
    
    // Assign tasks
    for (const task of unassignedTasks) {
      const assignment = await this.assignTaskToTeamMember(task._id, userId, session_id);
      assignments.push(assignment);
    }
    
    return {
      type: 'assignments_created',
      assignments: assignments,
      message: `Created ${assignments.length} assignments for your team members.`
    };
  }

  // Helper methods
  async createTasksForGoal(goalId, userId, session_id) {
    const taskCount = Math.floor(Math.random() * 3) + 2; // 2-4 tasks
    const tasks = [];
    
    console.log("checking task creation", session_id)

    for (let i = 0; i < taskCount; i++) {
      const taskTemplate = this.getRandomItem(this.dummyTasks);
      const task = new AITask({
        title: taskTemplate.title,
        description: taskTemplate.description,
        priority: taskTemplate.priority,
        due_date: this.getRandomFutureDate(),
        created_by: userId,
        ai_goal: goalId,
        status: 'pending',
        session_id
      });
      await task.save();
      tasks.push(task);
    }
    
    return tasks;
  }

  async assignGoalAndTasks(goalId, tasks, userId, session_id) {
    // Assign goal
    await this.assignGoalToTeamMember(goalId, userId, session_id);
    
    // Assign tasks
    for (const task of tasks) {
      await this.assignTaskToTeamMember(task._id, userId, session_id);
    }
  }

   async assignGoalToTeamMember(goalId, assignedBy, session_id) {
    const teamMember = await this.getRandomTeamMember(assignedBy);
    if (!teamMember) return null;
    
    const assignment = new AIGoalAssignment({
      ai_goal: goalId,
      assigned_by: assignedBy,
      assigned_to: teamMember._id
    });
    
    await assignment.save();
    await AIGoal.findByIdAndUpdate(goalId, { status: 'in_progress' });
    
    return assignment;
  }

    async assignTaskToTeamMember(taskId, assignedBy, session_id) {
    const teamMember = await this.getRandomTeamMember(assignedBy);
    if (!teamMember) return null;
    
    const assignment = new AITaskAssignment({
      ai_task: taskId,
      assigned_by: assignedBy,
      assigned_to: teamMember._id
    });
    
    await assignment.save();
    await AITask.findByIdAndUpdate(taskId, { status: 'in_progress' });
    
    return assignment;
  }

  async getRandomTeamMember(excludeUserId) {
    const users = await User.find({ _id: { $ne: excludeUserId } }).limit(10);
    return users.length > 0 ? this.getRandomItem(users) : null;
  }

  // Utility methods
  getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  getRandomFutureDate() {
    const today = new Date();
    const futureDate = new Date(today.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000); // Up to 30 days
    return futureDate;
  }

  parseDueDate(dateString) {
    const today = new Date();
    switch (dateString.toLowerCase()) {
      case 'today':
        return today;
      case 'tomorrow':
        return new Date(today.getTime() + 24 * 60 * 60 * 1000);
      case 'next week':
        return new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'this week':
        return new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
      case 'next month':
        return new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      default:
        return this.getRandomFutureDate();
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Method to upgrade to real AI (implement when you get API key)
  async callRealAI(message, userId) {
    if (!this.config.apiKey) {
      throw new Error('AI API key not configured');
    }
    
    // TODO: Implement real AI API call here
    // Example for OpenAI:
    /*
    const openai = new OpenAI({ apiKey: this.config.apiKey });
    
    const prompt = `
    You are an AI assistant that helps with task delegation and project management.
    User message: "${message}"
    
    Please analyze this message and determine:
    1. What goals or tasks need to be created
    2. How to break down complex goals into smaller tasks
    3. Who these should be assigned to (based on team member skills)
    4. Priority levels and due dates
    
    Respond in JSON format with the following structure:
    {
      "message": "Your response to the user",
      "intent": "create_goal|create_task|assign_work|general",
      "entities": {
        "priority": "low|medium|high|urgent",
        "dueDate": "ISO date string",
        "assignees": ["list of suggested assignees"],
        "tags": ["relevant tags"]
      },
      "actionItems": [
        {
          "type": "goal|task",
          "title": "Item title",
          "description": "Item description",
          "priority": "priority level"
        }
      ]
    }
    `;
    
    const response = await openai.chat.completions.create({
      model: this.config.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature
    });
    
    return JSON.parse(response.choices[0].message.content);
    */
    
    // For now, fall back to dummy implementation
    return this.generateAIResponse(message, userId);
  }
}

module.exports = new AIService();