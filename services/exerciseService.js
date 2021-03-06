const db = require("../db-handlers");
const errorService = require("./errorService");

const createExercise = async (req, res, next) => {
  const user = await req.user;
  try {
    const exercise = await db.insertExercise(
      req.params.userId,
      req.body.description,
      req.body.duration,
      req.body.date
    );
    if (!exercise) {
      throw new errorService.CustomError(404, `Can not create exercise.`);
    }
    user.exercise = exercise;
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { createExercise };
