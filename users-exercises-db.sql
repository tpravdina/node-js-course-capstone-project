PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
	_id INTEGER PRIMARY KEY ASC,
	username VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS exercises (
	id INTEGER PRIMARY KEY ASC,
	_id INTEGER,
    description VARCHAR(1000),
    duration INTEGER,
    date DATE,
    FOREIGN KEY (_id) REFERENCES users(_id)--
);
