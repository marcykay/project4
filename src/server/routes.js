module.exports = (app, db) => {

    const dashboard = require('./controllers/dashboard')(db);
    app.get('/data/:user', dashboard.getBusPreference);
    app.post('/data/buspreference', dashboard.addBusPreference);
    app.delete('/data/:user/:id', dashboard.deleteBusPreference);
    app.post('/secret', dashboard.uploadBusStopCodes);
    app.get('/register', dashboard.register);
    app.post('/register', dashboard.registerNewUser);
    app.get('/login', dashboard.login);
    app.post('/login', dashboard.authenticateLogin);
    app.get('/logout', dashboard.logoutUser);
    app.get('/', dashboard.get);

};
