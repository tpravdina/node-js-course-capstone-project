const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("./db-handlers");
const userService = require("./services/userService");
const errorService = require("./services/errorService");
const exerciseService = require("./services/exerciseService");
const validationService = require("./services/validationService");

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

  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
  });
  app.post("/api/users", userService.createUser);
  app.get("/api/users", userService.getAllUsers);
  app.use(
    ["/api/users/:userId/exercises", "/api/users/:userId/logs"],
    userService.loadUserById
  );
  app.post("/api/users/:userId/exercises", exerciseService.createExercise);
  app.get("/api/users/:_id/logs", validationService.validateParams);
  app.get("/api/users/:_id/logs", userService.getUserLog);

  app.use(() => {
    throw new errorService.CustomError(404, "Page not found");
  });

  app.use((err, req, res, next) => {
    errorService.handleError(err, res);
  });

  const listener = app.listen(process.env.PORT || PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
  });
}
