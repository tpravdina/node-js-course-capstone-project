const path = require("path");
const fs = require("fs");
const util = require("util");
const sqlite3 = require("sqlite3");
require("dotenv").config();

const DB_PATH = path.join(__dirname, "users-exercises.db");
const DB_SQL_PATH = path.join(__dirname, "users-exercises-db.sql");

const myDB = new sqlite3.Database(DB_PATH);
const SQL3 = {
  run(...args) {
    return new Promise((resolve, reject) => {
      myDB.run(...args, function onResult(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  },
  get: util.promisify(myDB.get.bind(myDB)),
  all: util.promisify(myDB.all.bind(myDB)),
  exec: util.promisify(myDB.exec.bind(myDB)),
};

const dbInit = async () => {
  let initSQL = fs.readFileSync(DB_SQL_PATH, "utf-8");
  await SQL3.exec(initSQL);
};

const insertUser = async (username) => {
  let result = await SQL3.run(
    `
      INSERT INTO
        users (username)
      VALUES
        (?)
    `,
    username
  );
  if (!result) {
    return null;
  }
  let userObj = {
    _id: result.lastID,
    username: username,
  };
  return userObj;
};

const insertOrLookupUser = async (username) => {
  let result = await getUserByUsername(username);
  if (result) {
    return null;
  }
  return await insertUser(username);
};

const insertExercise = async (_id, description, duration, date) => {
  const dateToInsert = date ? date : new Date().toISOString().slice(0, 10);
  let result = await SQL3.run(
    `
      INSERT INTO
        exercises (_id, description, duration, date)
      VALUES
        (?, ?, ?, ?)
    `,
    [_id, description, duration, dateToInsert]
  );
  if (!result) {
    return null;
  }
  let exerciseObj = {
    _id: _id,
    description: description,
    duration: duration,
    date: dateToInsert,
  };
  return exerciseObj;
};

const getAllUsers = async () => {
  const result = await SQL3.all(
    `
      SELECT
        *
      FROM
        users
    `
  );
  if (!result) {
    return null;
  }
  return result;
};

const getAllExercises = async () => {
  const result = await SQL3.all(
    `
      SELECT
        *
      FROM
      exercises
    `
  );
  if (!result) {
    return null;
  }
  return result;
};

const getUserByUsername = async (username) => {
  let result = await SQL3.get(
    `
    SELECT
      _id, username
    FROM
      users
    WHERE
      username = ?
	`,
    username
  );
  if (!result) {
    return null;
  }
  return {
    _id: result._id,
    username: result.username,
  };
};

const getUserById = async (id) => {
  let result = await SQL3.get(
    `
    SELECT
      _id, username
    FROM
      users
    WHERE
      _id = ?
	`,
    id
  );
  if (!result) {
    return null;
  }
  return {
    _id: result._id,
    username: result.username,
  };
};

const getExercisesByUserIdFromTo = async (id, from, to) => {
  let queryParams = [];
  let queryStr = `
	SELECT
    description, duration, date
	FROM
    exercises
	WHERE
    _id = ?
	`;
  queryParams.push(id);
  if (from) {
    queryStr += `AND date>?`;
    queryParams.push(from);
  }
  if (to) {
    queryStr += `AND date<?`;
    queryParams.push(to);
  }

  let result = await SQL3.all(queryStr, queryParams);
  if (!result) {
    return [];
  }
  return result;
};

module.exports = {
  dbInit,
  insertUser,
  insertOrLookupUser,
  insertExercise,
  getAllUsers,
  getAllExercises,
  getUserById,
  getExercisesByUserIdFromTo,
};
