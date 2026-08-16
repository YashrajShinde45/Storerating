const sendResponse = require("../utils/response");

const checkHealth = (req, res) => {
  sendResponse(res, 200, "Backend is running successfully", {
    service: "Store Rating Platform API",
  });
};

module.exports = {
  checkHealth,
};