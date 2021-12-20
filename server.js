const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const db = require("./db-handlers");

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
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
  });

  app.post("/api/users", async (req, res, next) => {
    try {
      const result = await db.insertOrLookupUser(req.body.username);
      res.end(JSON.stringify(result));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/users", async (req, res, next) => {
    try {
      const users = await db.getAllUsers();
      res.end(JSON.stringify(users));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/users/:_id/exercises", async (req, res, next) => {
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
  });

  app.get("/api/users/:_id/logs", async (req, res, next) => {
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
  });
};
