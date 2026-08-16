const bcrypt = require("bcrypt");

const sendResponse = require("../utils/response");

const {
  validatePassword,
} = require("../validations/userValidation");

const {
  getOwnerDashboard,
  getRatingUsers,
  updateOwnerPassword,
} = require("../models/ownerModel");

const dashboard = async (req, res, next) => {
  try {
    const stores = await getOwnerDashboard(req.user.id);
    const users = await getRatingUsers(req.user.id);

    sendResponse(res, 200, "Owner dashboard fetched", {
      stores,
      ratedUsers: users,
    });
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

    const hashedPassword = await bcrypt.hash(password, 10);

    await updateOwnerPassword(req.user.id, hashedPassword);

    sendResponse(res, 200, "Password updated successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  dashboard,
  changePassword,
};
