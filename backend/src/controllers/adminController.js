const bcrypt = require("bcrypt");
const sendResponse = require("../utils/response");
const {
  getDashboardCounts,
  createAdminUser,
  getUsers,
  getUserById,
  createStore,
  getStores,
  updateAdminPassword,
} = require("../models/adminModel");
const { findUserByEmail } = require("../models/userModel");
const { validateUser, validateStore } = require("../validations/adminValidation");
const { validatePassword } = require("../validations/userValidation");

const dashboard = async (req, res, next) => {
  try {
    const data = await getDashboardCounts();

    sendResponse(res, 200, "Dashboard data", data);
  } catch (error) {
    next(error);
  }
};

const addUser = async (req, res, next) => {
  try {
    const errors = validateUser(req.body);

    if (errors.length) {
      return sendResponse(res, 400, errors[0], errors);
    }

    const existing = await findUserByEmail(req.body.email);

    if (existing) {
      return sendResponse(res, 409, "Email already exists");
    }

    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = await createAdminUser({
      ...req.body,
      password: hashed,
    });

    sendResponse(res, 201, "User created", user);
  } catch (error) {
    next(error);
  }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await getUsers(req.query);

    sendResponse(res, 200, "Users fetched", users);
  } catch (error) {
    next(error);
  }
};

const userDetails = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    sendResponse(res, 200, "User details", user);
  } catch (error) {
    next(error);
  }
};

const addStore = async (req, res, next) => {
  try {
    const errors = validateStore(req.body);

    if (errors.length) {
      return sendResponse(res, 400, errors[0], errors);
    }

    const store = await createStore(req.body);

    sendResponse(res, 201, "Store created", store);
  } catch (error) {
    next(error);
  }
};

const listStores = async (req, res, next) => {
  try {
    const stores = await getStores(req.query);

    sendResponse(res, 200, "Stores fetched", stores);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!validatePassword(password)) {
      return sendResponse(res, 400, "Invalid password format.");
    }

    const hashed = await bcrypt.hash(password, 10);

    await updateAdminPassword(req.user.id, hashed);

    sendResponse(res, 200, "Password updated successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  dashboard,
  addUser,
  listUsers,
  userDetails,
  addStore,
  listStores,
  changePassword,
};
