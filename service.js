const db = require("./db-handlers");

const showStartPage = (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
};

const createUser = async (req, res, next) => {
  try {
    const result = await db.insertOrLookupUser(req.body.username);
    res.end(JSON.stringify(result));
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await db.getAllUsers();
    res.end(JSON.stringify(users));
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
      res.end(JSON.stringify(user));
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

const getExercisesByUserId = async (req, res, next) => {
  const id = req.params._id;

  const limit = req.query.limit;
  const from = req.query.from;
  const to = req.query.to;

  try {
    const user = await db.getUserById(id);
    try {
      const exercises = await db.getExercisesByUserId(id, limit, from, to);
      const count = exercises.length;
      user.count = count;
      user.exercises = exercises;
      res.end(JSON.stringify(user));
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  createExercise,
  getExercisesByUserId,
  showStartPage,
};
