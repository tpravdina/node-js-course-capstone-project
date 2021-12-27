const errorService = require("./errorService");

const validateParams = (req, res, next) => {
  const id = req.params.userId;

  const limit = req.query.limit;
  const from = req.query.from;
  const to = req.query.to;

  try {
    if (!isIdValid(id)) {
      throw new errorService.CustomError(400, "Invalid 'id' value.");
    }

    if (limit) {
      if (!isLimitValid(limit)) {
        throw new errorService.CustomError(400, "Invalid 'limit' value.");
      }
    }
    if (from) {
      if (!isDateValid(from)) {
        throw new errorService.CustomError(400, "Invalid 'from' value.");
      }
    }
    if (to) {
      if (!isDateValid(to)) {
        throw new errorService.CustomError(400, "Invalid 'to' value.");
      }
    }
  } catch (error) {
    next(error);
  }
  next();
};

const isIdValid = (id) => {
  return /^\d+$/.test(id);
};

const isLimitValid = (limit) => {
  return /^\d+$/.test(limit);
};

const isDateValid = (date) => {
  return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date);
};

module.exports = { validateParams };
