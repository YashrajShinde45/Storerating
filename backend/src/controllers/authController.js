const bcrypt = require("bcrypt");

const sendResponse = require("../utils/response");
const generateToken = require("../utils/token");

const {
  findUserByEmail,
  createUser,
} = require("../models/userModel");

const {
  validateRegister,
} = require("../validations/authValidation");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);

    if (!user) {
      return sendResponse(res, 401, "Invalid email or password");
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
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

const register = async (req, res, next) => {
  try {
    const { name, email, address, password } = req.body;

    const errors = validateRegister({
      name,
      email,
      address,
      password,
    });

    if (errors.length) {
      return sendResponse(res, 400, "Validation failed", errors);
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return sendResponse(res, 409, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      address,
      role: "user",
    });

    const token = generateToken(newUser);

    sendResponse(res, 201, "Registration successful", {
      token,
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
};