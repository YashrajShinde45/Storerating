const bcrypt = require("bcrypt");
const sendResponse = require("../utils/response");
const {
  getStores,
  getUserRating,
  addRating,
  updateRating,
  updatePassword,
} = require("../models/userFeatureModel");
const {
  validateRating,
  validatePassword,
} = require("../validations/userValidation");

const listStores = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const stores = await getStores(req.user.id, search);

    sendResponse(res, 200, "Stores fetched", stores);
  } catch (error) {
    next(error);
  }
};

const submitRating = async (req, res, next) => {
  try {
    const rating = Number(req.body.rating);

    if (!validateRating(rating)) {
      return sendResponse(res, 400, "Rating must be between 1 and 5.");
    }

    const existing = await getUserRating(
      req.user.id,
      req.params.id
    );

    if (existing) {
      return sendResponse(
        res,
        409,
        "Rating already exists. Use update."
      );
    }

    const newRating = await addRating(
      req.user.id,
      req.params.id,
      rating
    );

    sendResponse(res, 201, "Rating submitted", newRating);
  } catch (error) {
    next(error);
  }
};

const editRating = async (req, res, next) => {
  try {
    const rating = Number(req.body.rating);

    if (!validateRating(rating)) {
      return sendResponse(res, 400, "Rating must be between 1 and 5.");
    }

    const updated = await updateRating(
      req.user.id,
      req.params.id,
      rating
    );

    sendResponse(res, 200, "Rating updated", updated);
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

    await updatePassword(req.user.id, hashed);

    sendResponse(res, 200, "Password updated successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listStores,
  submitRating,
  editRating,
  changePassword,
};
