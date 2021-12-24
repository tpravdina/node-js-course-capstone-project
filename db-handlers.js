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
  if (!result || !result.lastID) {
    throw new Error("Can't insert the user.");
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
    throw new Error(`User with username "${username}" already exist.`);
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
  if (!result || !result.lastID) {
    throw new Error(`Can't create an exercise.`);
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
    throw new Error("Can not get users.");
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
  if (!result || !result._id) {
    return false;
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
  if (!result || !result._id) {
    throw new Error(`No user exists with id=${id}.`);
  }
  return {
    _id: result._id,
    username: result.username,
  };
};

const getFilteredExercisesByUserId = async (id, from, to) => {
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

const getUserLog = async (id, limit, from, to) => {
  let user = await getUserById(id);
  let exercises = await getFilteredExercisesByUserId(id, from, to);
  const totalCount = exercises.length;
  if (limit) {
    exercises = exercises.slice(0, limit);
  }
  const userLog = {
    ...user,
    count: totalCount,
    exercises: exercises,
  };
  return userLog;
};

module.exports = {
  dbInit,
  insertUser,
  insertOrLookupUser,
  insertExercise,
  getAllUsers,
  getUserById,
  getUserLog,
};
