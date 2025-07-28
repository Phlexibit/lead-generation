require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const Role = require("./models");

const getRoles = async (req, res) => {
  const id = req?.body?.id;
  
  if (id) {
    const role = await Role.findById(id);
    if (!role) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Role not found",
      });
    }
    return res.status(StatusCodes.OK).json({
      role: role,
    });
  }
  
  const roles = await Role.find().sort({ createdAt: -1 }).limit(10);

  return res.status(StatusCodes.OK).json({
    roles: roles,
  });
};


module.exports = {
  getRoles,
};
