const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String
  },
  number: {
    type: String
  },
  roles: [{
    type: Schema.Types.ObjectId,
    ref: 'Role'
  }],
  refresh_token: {
    type: String
  }
}, {
  timestamps: true
});

// Create index on roles field for faster lookups
userSchema.index({ roles: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;