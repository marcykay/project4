## Unit 04
## Project Title: Have a Good Day
This is a dashboard app built on NodeJS. Essentially it fetches weather info and bus arrivals infomration based on user's preferences.

## Technologies used
- Node JS, Express, React, PostgreSQL
- LTA Bus Arrival, Bus Stops, and Bus Routes
- NEA 24hr Weather Forecast Dataset

## Settings Up
1. To set up, download the project and do a NPM Install.
2. Setup the Database "haveagoodday"
3. Create the tables by running
    psql -d haveagoodday -U USERNAME -f ./src/server/tables.sql
