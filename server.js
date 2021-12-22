const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("./db-handlers");
const {
  createUser,
  getAllUsers,
  createExercise,
  getUserLog,
  showStartPage,
} = require("./service");

const PORT = 3000;

main();

async function main() {
  app.use(cors());
  app.use(express.static("public"));

  //For parsing body
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  await db.dbInit();

  defineRoutes();

  const listener = app.listen(process.env.PORT || PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
}

const defineRoutes = () => {
  app.get("/", showStartPage);
  app.post("/api/users", createUser);
  app.get("/api/users", getAllUsers);
  app.post("/api/users/:_id/exercises", createExercise);
  app.get("/api/users/:_id/logs", getUserLog);
};
