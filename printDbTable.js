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

const printJoin = async () => {
  console.log("Join:");
  console.log(await getCountOfExercisesByUserIdFromTo(1, "2022-12-29"));
  console.table(await getUserWithExercisesByIdFromToLimit(1, "", "", 2));
};

const main = (async () => {
  await printUsers();
  await printExercises();
  await printJoin();
})();
