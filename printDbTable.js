const { getAllUsers, getAllExercises } = require("./db-handlers");

const printUsers = async () => {
  console.table(await getAllUsers());
};
printUsers();

const printExercises = async () => {
  console.table(await getAllExercises());
};
printExercises();
