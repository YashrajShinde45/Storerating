const validateUser = ({ name, email, address, password, role }) => {
  const errors = [];

  if (!name || name.trim().length < 20 || name.trim().length > 60) {
    errors.push("Name must be between 20 and 60 characters.");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    errors.push("Invalid email.");
  }

  if (!address || address.length > 400) {
    errors.push("Address cannot exceed 400 characters.");
  }

  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

  if (!passwordPattern.test(password)) {
    errors.push("Invalid password format.");
  }

  if (!["admin", "user", "owner"].includes(role)) {
    errors.push("Invalid role.");
  }

  return errors;
};

module.exports = {
  validateUser,
};
