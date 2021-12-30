const errorService = require("./errorService");

const validateExercise = (req, res, next) => {
  const description = req.body.description;
  const duration = req.body.duration;
  const date = req.body.date;
  try {
    if (!description) {
      throw new errorService.CustomError(
        400,
        "Can not add exercise with no description."
      );
    }
    if (!duration || !isNumber(duration)) {
      throw new errorService.CustomError(400, "Incorrect duration.");
    }
    if (!(isDateValid(date) || date === "")) {
      throw new errorService.CustomError(400, "Incorrect date.");
    }
  } catch (error) {
    next(error);
  }
  next();
};

const validateFilterParams = (req, res, next) => {
  const id = req.params.userId;

  const limit = req.query.limit;
  const from = req.query.from;
  const to = req.query.to;

  try {
    if (!isNumber(id)) {
      throw new errorService.CustomError(400, "Invalid 'id' value.");
    }

    if (limit) {
      if (!isNumber(limit)) {
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

const isNumber = (id) => {
  return /^\d+$/.test(id);
};

const isDateValid = (date) => {
  return /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(date);
};

module.exports = { validateFilterParams, validateExercise };
