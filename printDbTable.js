const {
  getAllUsers,
  getAllExercises,
  getUserWithExercisesByIdFromToLimit,
  getCountOfExercisesByUserIdFromTo,
} = require("./db-handlers");

const printUsers = async () => {
  console.log("Users table:");
  console.table(await getAllUsers());
};

const printExercises = async () => {
  console.log("Exercises table:");
  console.table(await getAllExercises());
};

const main = (async () => {
  await printUsers();
  await printExercises();
})();
