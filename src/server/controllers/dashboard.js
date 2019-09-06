const hashFunc = require('js-sha256');
const {resolve} = require('path');
const clientBuildPath = resolve(__dirname, '..', '..', 'client');

module.exports = (db) => {

    let get = (request, response) => {
        if (checkSession(request)) {
            let currentUserId = request.cookies['user_id'];
            console.log("=========ALREADY LOGIN=============");
            // db.query.getAllNotes(currentUserId, (error, allResults) => {
            //     let currentUserId = request.cookies['user_id'];
            //     console.log("loadIndex======================");
            //     response.render('/gogo', {
            //         'allResults': allResults
            //     });
            // });
            response.redirect('/gogo');
        } else {
            response.redirect('/login');

        }
    };

    let login = (request, response) => {
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

    let register = (request, response) => {
        console.log("Register Load Function");
        response.render('dashboard/register');
    };

    let registerNewUser = (request, response) => {
        console.log("Register New User Function");
        let data = [request.body.username, hashFunc(request.body.password)];
        db.query.addUser(data, (error, results) => {
            if (error !== null) {
                let errormessage = `<h2>DUPLICATE USERNAME. CHOOSE ANOTHER.</h2><h5>${error.detail}</h5>`;
                response.status(403).send(errormessage);
                return;
            } else {
                giveCookie(results[0].id, request.body.username, response);
                console.log("##### login successful ##### ")
                response.redirect('/gogo');
                return;
            }
        });
    };

    let logoutUser = (request, response) => {
        console.log("Logout Function");
        destroyCookie(response);
        response.redirect('/');
    };

    let uploadBusStopCodes = (request, response) => {
        let d = Date(Date.now());
        console.log("+++++++++++++" );
        console.log("+++++++++++++" );
        request.body.data.map((info)=>{
            let values = [info.BusStopCode, info.Description, info.Latitude, info.Longitude, info.RoadName];
                 db.query.addData(values, (error, allResults) => {
                     console.log("");
                     console.log("");
                     console.log(allResults);
                     console.log("");
                     console.log("");
                 });
        });
        response.status(200).send("OK!");
    }

    // Helper Functions
    let giveCookie = function(userId, username, response) {
        let currentSessionCookie = hashFunc(userId + 'logged_id');
        response.cookie('haveagoodday', currentSessionCookie);
        response.cookie('user_id', userId);
        response.cookie('username', username);
        console.log("cookie issued!");
    }

    let destroyCookie = function(response) {
        response.cookie('haveagoodday', "");
        response.cookie('user_id', "");
        response.cookie('username', "");
    }

    let checkSession = function(request) {
        let validSession = request.cookies['haveagoodday'];
        let validUser = request.cookies['user_id'];
        if (validSession && validUser) {
            if (hashFunc(validUser + 'logged_id') === validSession) {
                return true;
            }
        }
        console.log("authentification error");
        return false;
    };

    return {
        get: get,
        login: login,
        authenticateLogin: authenticateLogin,
        register: register,
        registerNewUser: registerNewUser,
        logoutUser: logoutUser,
        uploadBusStopCodes: uploadBusStopCodes
    }

};
