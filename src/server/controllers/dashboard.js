const hashFunc = require('js-sha256');
const {resolve} = require('path');
const clientBuildPath = resolve(__dirname, '..', '..', 'client');

module.exports = (db) => {

    let get = function(request, response){
        if (checkSession(request)) {
            let currentUserId = request.cookies['user_id'];
            console.log("=========ALREADY LOGIN=============");
            response.redirect('/gogo');
        } else {
            response.redirect('/login');

        }
    };

    let login = function(request, response){
        logoutUser(request,response);
        console.log("Login Load Function");
        response.render('dashboard/login');
    };

    let authenticateLogin = (request, response) => {
        console.log("Authenticate Login");
        let hashedPW = hashFunc(request.body.password);
        let data = [request.body.username];
        db.query.getUserLogin(data, (error, results) => {
            if (results === null) {
                console.log("403 - user not found");
                response.status(403).send("<h2>USER NOT FOUND</h2>");
                return;
            } else {
                if (results[0].password === hashedPW) {
                    giveCookie(results[0].id, request.body.username, response);
                    let currentUser = results[0].id;
                    console.log("##### login successful ##### ")
                    response.redirect('/gogo');
                    return;
                } else {
                    response.status(403).send("<h2>WRONG PASSWORD</h2>");
                    console.log("403 - salah password");
                    return;
                }
            }
        });
    }

    let register = function(request, response){
        logoutUser(request,response);
        console.log("Register Load Function");
        response.render('dashboard/register');
    };

    let registerNewUser = function(request, response){
        console.log("Register New User Function");
        let data = [request.body.username, hashFunc(request.body.password)];
        db.query.addUser(data, (error, results) => {
            if (error !== null) {
                let errormessage = `<h2>DUPLICATE USERNAME. CHOOSE ANOTHER.</h2><h5>${error.detail}</h5>`;
                response.status(403).send(errormessage);
            } else {
                giveCookie(results[0].id, request.body.username, response);
                console.log("##### login successful ##### ")
                response.redirect('/gogo');
            }
        });
    };

    let logoutUser = function(request, response){
        console.log("Logout Function");
        destroyCookie(response);
    };

    let uploadBusStopCodes = function(request, response){
        request.body.data.map((info)=>{
            let values = [info.BusStopCode, info.Description, info.Latitude, info.Longitude, info.RoadName];
                db.query.addData(values, (error, allResults) => {
                    if (error === null) {
                        console.log(allResults);
                        response.status(200).send(allResults[0]);
                    } else {
                        let errormessage = `<h2>Error!</h2><h5>${error.detail}</h5>`;
                        response.status(406).send(errormessage);
                    }
                });
        });
        response.status(200).send("OK!");
    }

    let addBusPreference = function(request, response) {
        console.log(request.body);
        let values = [request.body.username, request.body.busstopcode, request.body.serviceno, request.body.roadname, request.body.description, request.body.latitude, request.body.longitude ];
        db.query.addBusPreference(values, (error, allResults) => {
            console.log(error);
            if (error === null) {
                console.log(error);
                response.status(200).send(allResults[0]);
            } else {
                let errormessage = `<h2>Error!</h2><h5>${error.detail}</h5>`;
                response.status(406).send(errormessage);
            }
        })
    }

    let getBusPreference = function(request, response) {
        console.log(request.params);
        let values = [request.params.user];
        db.query.getBusPreference(values, (error, allResults) => {

            console.log(error);
            if (error === null) {
                console.log(error);
                let data = {'results': allResults};
                console.log(JSON.stringify(data));
                response.status(200).send(JSON.stringify(data));
            } else {
                let errormessage = `<h2>Error!</h2><h5>${error.detail}</h5>`;
                response.status(406).send(errormessage);
            }
        })
    }


    // Helper Functions
    function giveCookie(userId, username, response) {
        let currentSessionCookie = hashFunc(userId + 'logged_id');
        response.cookie('haveagoodday', currentSessionCookie);
        response.cookie('user_id', userId);
        response.cookie('username', username);
    }

    function destroyCookie(response) {
        response.cookie('haveagoodday', "");
        response.cookie('user_id', "");
        response.cookie('username', "");
    }

    function checkSession(request) {
        let validSession = request.cookies['haveagoodday'];
        let validUser = request.cookies['user_id'];
        if (validSession && validUser) {
            if (hashFunc(validUser + 'logged_id') === validSession) {
                return true;
            }
        }
        return false;
    };

    return {
        get: get,
        login: login,
        authenticateLogin: authenticateLogin,
        register: register,
        registerNewUser: registerNewUser,
        logoutUser: logoutUser,
        uploadBusStopCodes: uploadBusStopCodes,
        addBusPreference: addBusPreference,
        getBusPreference: getBusPreference,
    }

};
