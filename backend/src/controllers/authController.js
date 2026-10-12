const bcrypt = require("bcrypt");

const sendResponse = require("../utils/response");
const generateToken = require("../utils/token");

const {
  findUserByEmail,
  findUserById,
  createUser,
  updateUserProfile,
  updateUserPassword,
  getUserStats,
} = require("../models/userModel");

const {
  validateRegister,
} = require("../validations/authValidation");

const {
  validatePassword,
} = require("../validations/userValidation");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, "Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);

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
        address: user.address,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, address, password, role } = req.body;

    const trimmedName = typeof name === "string" ? name.trim() : "";
    const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const trimmedAddress = typeof address === "string" ? address.trim() : "";
    const selectedRole = typeof role === "string" && ["admin", "owner", "user"].includes(role.toLowerCase().trim())
      ? role.toLowerCase().trim()
      : "user";

    const errors = validateRegister({
      name: trimmedName,
      email: normalizedEmail,
      address: trimmedAddress,
      password,
      role: selectedRole,
    });

    if (errors.length) {
      return sendResponse(res, 400, errors[0], errors);
    }

    const existingUser = await findUserByEmail(normalizedEmail);

    if (existingUser) {
      return sendResponse(res, 409, "Email is already registered. Please login instead.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      address: trimmedAddress,
      role: selectedRole,
    });

    const token = generateToken(newUser);

    sendResponse(res, 201, "Registration successful", {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        address: newUser.address,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return sendResponse(res, 404, "User not found");
    }

    const stats = await getUserStats(user.id, user.role);

    sendResponse(res, 200, "Profile retrieved successfully", {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        created_at: user.created_at,
      },
      stats: stats || {},
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, address } = req.body;

    const updates = {};

    if (name !== undefined) {
      const trimmedName = name.trim();
      if (trimmedName.length < 20 || trimmedName.length > 60) {
        return sendResponse(res, 400, "Name must be between 20 and 60 characters.");
      }
      updates.name = trimmedName;
    }

    if (address !== undefined) {
      const trimmedAddress = address.trim();
      if (trimmedAddress.length > 400) {
        return sendResponse(res, 400, "Address cannot exceed 400 characters.");
      }
      updates.address = trimmedAddress;
    }

    const updatedUser = await updateUserProfile(req.user.id, updates);

    sendResponse(res, 200, "Profile updated successfully", updatedUser);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { password, currentPassword } = req.body;

    if (!validatePassword(password)) {
      return sendResponse(
        res,
        400,
        "Password must be 8-16 characters and contain at least one uppercase letter and one special character."
      );
    }

    // Optional verification of current password if provided
    if (currentPassword) {
      const user = await findUserById(req.user.id);
      const fullUser = await findUserByEmail(user.email);
      const matched = await bcrypt.compare(currentPassword, fullUser.password);
      if (!matched) {
        return sendResponse(res, 400, "Current password does not match.");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await updateUserPassword(req.user.id, hashedPassword);

    sendResponse(res, 200, "Password updated successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
};