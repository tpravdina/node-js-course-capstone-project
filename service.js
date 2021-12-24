const db = require("./db-handlers");
const { isIdValid, isLimitValid, isDateValid } = require("./validation");

const showStartPage = (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
};

const createUser = async (req, res, next) => {
  try {
    const user = await db.insertOrLookupUser(req.body.username);
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const createExercise = async (req, res, next) => {
  try {
    const user = await db.getUserById(req.body[":_id"]);
    try {
      const exercise = await db.insertExercise(
        req.body[":_id"],
        req.body.description,
        req.body.duration,
        req.body.date
      );
      user.exercise = exercise;
      res.json(user);
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const invalidValue404Error = (res, valueName) => {
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.write(`Invalid "${valueName}" value.`);
  res.end();
};

const getUserLog = async (req, res, next) => {
  const id = req.params._id;

  const limit = req.query.limit;
  const from = req.query.from;
  const to = req.query.to;

  // Validation
  if (!isIdValid(id)) {
    invalidValue404Error(res, "_id");
    next();
    return;
  }

  if (limit) {
    if (!isLimitValid(limit)) {
      invalidValue404Error(res, "limit");
      next();
      return;
    }
  }
  if (from) {
    if (!isDateValid(from)) {
      invalidValue404Error(res, "from");
      next();
      return;
    }
  }
  if (to) {
    if (!isDateValid(to)) {
      invalidValue404Error(res, "to");
      next();
      return;
    }
  }

  try {
    const userLog = await db.getUserLog(id, limit, from, to);
    res.json(userLog);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  showStartPage,
  createUser,
  createExercise,
  getAllUsers,
  getUserLog,
};
