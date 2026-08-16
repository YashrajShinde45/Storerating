const validateRegister = ({ name, email, address, password }) => {
  const errors = [];

  if (!name || name.trim().length < 20 || name.trim().length > 60) {
    errors.push("Name must be between 20 and 60 characters.");
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailPattern.test(email)) {
    errors.push("Enter a valid email address.");
  }

  if (!address || address.length > 400) {
    errors.push("Address cannot exceed 400 characters.");
  }

  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

  if (!passwordPattern.test(password)) {
    errors.push(
      "Password must be 8-16 characters with at least one uppercase letter and one special character."
    );
  }

  return errors;
};

module.exports = {
  validateRegister,
};