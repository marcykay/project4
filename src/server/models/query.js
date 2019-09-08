/**
 * ===========================================
 * Export model functions as a module
 * ===========================================
 */
module.exports = (dbPoolInstance) => {

    // `dbPoolInstance` is accessible within this function scope

    let addUser = (values, callback) => {
        let query = 'INSERT INTO users (name, password) values ($1, $2) returning *';
        dbPoolInstance.query(query, values, (error, queryResult) => {
            if (error) {
                callback(error, null);
            } else {
                if (queryResult.rows.length > 0) {
                    callback(null, queryResult.rows);
                } else {
                    callback(null, null);
                }
            }
        });
    };

    let getUserLogin = (data, callback) => {
        let query = 'SELECT * FROM users WHERE name=($1)';
        // let data = [];
        // values.push(data[0]);

        dbPoolInstance.query(query, data, (error, queryResult) => {
            if (error) {
                callback(error, null);
            } else {
                if (queryResult.rows.length > 0) {
                    callback(null, queryResult.rows);
                } else {
                    callback(null, null);
                }
            }
        });
    }

    let addData = (values, callback) => {
        let query = 'INSERT INTO bus_stops_codes (busstopcode, description, latitude, longitude, roadname) values ($1, $2, $3, $4, $5) returning id';
        dbPoolInstance.query(query, values, (error, queryResult) => {
            if (error) {
                callback(error, null);
            } else {
                if (queryResult.rows.length > 0) {
                    callback(null, queryResult.rows);
                } else {
                    callback(null, null);
                }
            }
        });
    };

    let addBusPreference = (values, callback) => {
        console.log("...");
        console.log("adding bus preference..................");
        console.log(values);
        let query = 'INSERT INTO bus_preference (username, busstopcode, serviceno, roadname, description, latitude, longitude) values ($1, $2, $3, $4, $5, $6, $7) returning *';
        dbPoolInstance.query(query, values, (error, queryResult) => {
            if (error) {
                console.log("error in database");
                callback(error, null);
            } else {
                if (queryResult.rows.length > 0) {
                    console.log(queryResult.rows[0]);
                    callback(null, queryResult.rows);
                } else {
                    callback(null, null);
                }
            }
        });
    };

    let getBusPreference = (values, callback) => {
        let query = 'SELECT * FROM bus_preference WHERE username=($1)';
        dbPoolInstance.query(query, values, (error, queryResult) => {
            if (error) {
                callback(error, null);
            } else {
                if (queryResult.rows.length > 0) {
                    callback(null, queryResult.rows);
                } else {
                    callback(null, null);
                }
            }
        });
    }

    return {
        addData,
        addUser,
        getUserLogin,
        addBusPreference,
        getBusPreference
    };
};

// INSERT INTO bus_stop_codes (busstopcode, description, latitude, longitude, roadname) values ('01013',"St. Joseph's Ch", 1.29770970610083,103.8532247463225,'Victoria St') returning id;
