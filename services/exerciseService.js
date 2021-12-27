const db = require("../db-handlers");
const errorService = require("./errorService");

const createExercise = async (req, res, next) => {
  const user = await req.user;
  try {
    const exercise = await db.insertExercise(
      req.body[":_id"],
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

const getExercisesByUserIdFromTo = async (id, from, to) => {
  return await db.getExercisesByUserIdFromTo(id, from, to);
};

module.exports = { createExercise, getExercisesByUserIdFromTo };
