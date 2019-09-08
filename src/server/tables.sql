-- create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    password TEXT
);

-- create bus preferences related table
CREATE TABLE IF NOT EXISTS bus_preference (
    id SERIAL PRIMARY KEY,
    username TEXT REFERENCES users(name),
    busstopcode TEXT,
    serviceno TEXT,
    roadname TEXT,
    description TEXT,
    latitude TEXT,
    longitude TEXT
);

-- create location preference table
CREATE TABLE IF NOT EXISTS location (
    id SERIAL PRIMARY KEY,
    username TEXT REFERENCES users(name),
    location TEXT UNIQUE
);

-- create bus stops codes table
CREATE TABLE IF NOT EXISTS bus_stops_codes (
    id SERIAL PRIMARY KEY,
    busstopcode TEXT UNIQUE,
    description TEXT,
    latitude TEXT,
    longitude TEXT,
    roadName TEXT
);
