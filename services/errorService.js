class CustomError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, res) => {
  const { statusCode, message } = err;
  res.status(statusCode);
  res.json({
    status: "error",
    statusCode,
    message,
  });
};

module.exports = {
  CustomError,
  handleError,
};
