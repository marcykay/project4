module.exports = (app, db) => {

  const dashboard = require('./controllers/dashboard')(db);

  app.get('/dashboard', dashboard.get);

  app.get('/api/dashboard', dashboard.apiget);

  //app.get('/', dashboard.frontPage);
};
