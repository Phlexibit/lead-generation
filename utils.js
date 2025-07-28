require("dotenv").config();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateToken = (user) => {
  const accessToken = JWT.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRY,
  });

  return accessToken;
};

const getHashedPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

module.exports = {
  generateToken,
  getHashedPassword,
};
