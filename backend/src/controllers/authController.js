const bcrypt = require("bcrypt");
const sendResponse = require("../utils/response");
const generateToken = require("../utils/token");
const { findUserByEmail } = require("../models/userModel");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    const token = generateToken(user);

    sendResponse(res, 200, "Login successful", {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};