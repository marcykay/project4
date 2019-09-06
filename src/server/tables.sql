-- create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE,
    password TEXT
);

-- create bus preferences related table
CREATE TABLE IF NOT EXISTS bus_preference (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    BusStopCode TEXT,
    ServiceNo TEXT
);

-- create location preference table
CREATE TABLE IF NOT EXISTS location (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    location TEXT UNIQUE
);

-- create bus stops codes table
CREATE TABLE IF NOT EXISTS bus_stops_codes (
    id SERIAL PRIMARY KEY,
    BusStopCode TEXT,
    Description TEXT,
    Latitude TEXT,
    Longitude TEXT,
    RoadName TEXT
);
