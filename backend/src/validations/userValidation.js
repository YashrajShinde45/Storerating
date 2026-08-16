const validateRating = (rating) => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};

const validatePassword = (password) => {
  const pattern =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/;

  return pattern.test(password);
};

module.exports = {
  validateRating,
  validatePassword,
};
