const db = require("../db-handlers");
const errorService = require("./errorService");
const exerciseService = require("./exerciseService");

const loadUserById = async (req, res, next) => {
  const userId = req.params.userId;
  if (!userId) {
    next();
    return;
  }

  try {
    const user = await db.getUserById(userId);
    if (!user) {
      throw new errorService.CustomError(
        404,
        `Can not found user with id=${userId}`
      );
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  const username = req.body.username;
  try {
    const user = await db.insertOrLookupUser(username);
    if (!user) {
      throw new errorService.CustomError(404, `Can not create the user.`);
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await db.getAllUsers();
    if (!users) {
      throw new errorService.CustomError(404, "Can not get users.");
    }
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const getUserLog = async (req, res, next) => {
  const user = req.user;

  const id = req.params.userId;

  const limit = req.query.limit;
  const from = req.query.from;
  const to = req.query.to;

  let exercises = await exerciseService.getExercisesByUserIdFromTo(
    id,
    from,
    to
  );
  const totalCount = exercises.length;
  if (limit) {
    exercises = exercises.slice(0, limit);
  }
  const userLog = {
    ...user,
    count: totalCount,
    exercises: exercises,
  };
  res.json(userLog);
};

module.exports = { loadUserById, createUser, getAllUsers, getUserLog };
