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
                console.log("error in add user")
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
        console.log(data);
        let query = 'SELECT * FROM users WHERE name=($1)';
        // let data = [];
        // values.push(data[0]);

        dbPoolInstance.query(query, data, (error, queryResult) => {
            if (error) {
                console.log("error :" + error);
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
        console.log("...");
        console.log("adding data..................");
        console.log(values);
        let query = 'INSERT INTO bus_stops_codes (busstopcode, description, latitude, longitude, roadname) values ($1, $2, $3, $4, $5) returning id';
        dbPoolInstance.query(query, values, (error, queryResult) => {
            if (error) {
                console.log("error in database");
                callback(error, null);
            } else {
                if (queryResult.rows.length > 0) {
                    console.log(queryResult);
                    callback(null, queryResult.rows);
                } else {
                    callback(null, null);
                }
            }
        });
    };


    return {
        addData,
        addUser,
        getUserLogin
    };
};

// INSERT INTO bus_stop_codes (busstopcode, description, latitude, longitude, roadname) values ('01013',"St. Joseph's Ch", 1.29770970610083,103.8532247463225,'Victoria St') returning id;
