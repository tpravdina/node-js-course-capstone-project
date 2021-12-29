const {
  getAllUsers,
  getAllExercises,
  getUserWithExercisesById,
} = require("./db-handlers");

const printUsers = async () => {
  console.log("Users table:");
  console.table(await getAllUsers());
};

const printExercises = async () => {
  console.log("Exercises table:");
  console.table(await getAllExercises());
};

const printJoin = async () => {
  console.log("Join:");
  console.table(await getUserWithExercisesById(3));
};

const main = (async () => {
  await printUsers();
  await printExercises();
  await printJoin();
})();
