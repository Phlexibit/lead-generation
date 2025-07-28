const jwt = require('jsonwebtoken')
// const { UnauthenticatedError } = require('../errors')
const { StatusCodes } = require('http-status-codes');
const User = require('../modules/user/models');

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Authentication Invalid",
    });
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload?.id).populate('roles', 'name');
    req.user = { id: payload.id, username: payload.username, role: user.roles[0].name }
    next()
  } catch (error) {
    // throw new UnauthenticatedError('Authentication invalid')
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "(ERROR) Authentication Invalid",
    });
  }
}


module.exports = auth
