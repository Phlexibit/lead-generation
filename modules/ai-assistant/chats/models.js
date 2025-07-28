const mongoose = require("mongoose");

const aiChatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userMessage: {
      type: String,
      required: true,
    },
    aiMessage: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatSession",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AIChat = mongoose.model("AIChat", aiChatSchema);

module.exports = AIChat;
