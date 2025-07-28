require("dotenv").config();
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { StatusCodes } = require("http-status-codes");
const User = require("./models");
const { BadRequestError, NotFoundError } = require("../../errors");
const { getHashedPassword, generateToken } = require("../../utils");

const getUser = async (req, res) => {
  const id = req?.query?.id;

  try {
    if (id) {
      const user = await User.findById(id).populate("roles", "name description");
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: "User not found",
        });
      }
      return res.status(StatusCodes.OK).json({
        user: user,
      });
    }

    const users = await User.find()
      .populate("roles", "name description")
      .sort({ createdAt: 1 })
      .limit(10);

    return res.status(StatusCodes.OK).json({
      users: users,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

const getUserList = async (req, res) => {
  try {
    const users = await User.find()
      .select('username first_name last_name _id')
      .populate("roles", "name description")
      .sort({ createdAt: 1 })
      .limit(10);

    return res.status(StatusCodes.OK).json({
      users: users,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  const { username, first_name, last_name, number, email, password, roles } =
    req.body;

    console.log('roles', roles);
    

  const hashedPassword = await getHashedPassword(password);

  const user = await User.create({
    username,
    first_name,
    last_name,
    number,
    email,
    roles,
    password: hashedPassword,
  });

  const createdUser = await User.find({ _id: user._id });

  return res.status(StatusCodes.OK).json({
    message: "User created Successfully",
    user: createdUser,
  });
};

const csvAddMembers = async (req, res) => {
  const users = req.body.users;

  try {
    if (!Array.isArray(users)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Request body must be an array of users",
      });
    }

    const createdUsers = await Promise.all(
      users.map(async (userData) => {
        const { username, first_name, last_name, number, email, password, roles } = userData;
        const hashedPassword = await getHashedPassword(password);

        const user = await User.create({
          username,
          first_name,
          last_name,
          number,
          email,
          roles,
          password: hashedPassword,
        });

        return User.findById(user._id);
      })
    );

    return res.status(StatusCodes.OK).json({
      message: "Users created Successfully",
      users: createdUsers,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Error creating users",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, number, email, roles } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    {
      first_name,
      last_name,
      number,
      email,
      roles,
    },
    { new: true }
  );

  const updatedUser = await User.find({ _id: id });

  return res.status(StatusCodes.OK).json({
    message: "User updated Successfully",
    user: updatedUser,
  });
};

const deleteUser = async (req, res) => {
  const id = req.params.id;

  await User.findByIdAndDelete(id);

  return res.status(StatusCodes.OK).json({
    message: "User deleted Successfully",
  });
};

const loginUser = async (req, res) => {
  const { id, email, username, password, username_or_email } = req.body;
  let query = {};
  if (username_or_email.includes("@")) {
    query.email = username_or_email;
  } else {
    query.username = username_or_email;
  }
  const user = await User.findOne(query).populate("roles", "name")
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "User not found",
    });
  }
  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Password entered is incorrect",
    });
  }
  const userPayload = {
    id: user._id,
    username: user.username,
  };
  const accessToken = generateToken(userPayload);
  const refreshToken = JWT.sign(userPayload, process.env.REFRESH_TOKEN_SECRET);

  await User.findByIdAndUpdate(user._id, {
    refresh_token: refreshToken,
  });

  return res.status(StatusCodes.OK).json({
    accessToken,
    refreshToken,
    user
  });
};

const logoutUser = async (req, res) => {
  const { id } = req.body;
  let user = await User.findById(id);

  if (user) {
    user.refresh_token = null;
    await user.save();
    return res.status(StatusCodes.OK).json({
      message: "User Logged Out Successfully",
    });
  } else {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "User not found",
    });
  }
};

const getToken = async (req, res) => {
  const { id, refreshToken } = req.body;

  if (refreshToken === null) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      Error: "Unauthorized Access",
    });
  }

  const checkTokenExists = await User.findById(id);

  if (!checkTokenExists || checkTokenExists.refresh_token === null) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      Error: "Unauthorized Access",
      message: "Couldn't find Access Token",
    });
  }

  JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "FORBIDDEN",
        JWT_Error: err,
      });
    }


    const accessToken = generateToken({
      id: user.id,
      username: user.username,
    });
    res.status(StatusCodes.OK).json({
      accessToken,
    });
  });
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  getToken,
  csvAddMembers,
  getUserList
};
