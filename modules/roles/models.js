const mongoose = require("mongoose");

const rolesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    is_default: {
      type: Boolean,
      default: false
    }, 
    description: {
      type: String,
    },
    permissions: {
      type: [{
        type: String,
      }],
      required: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  {
    timestamps: true,
  }
);

const Role = mongoose.model("Role", rolesSchema);

module.exports = Role;
