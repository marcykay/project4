const http = require('http');
const express = require('express');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const db = require('./db');
const hashFunc = require('js-sha256');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

function onUnhandledError(err) {
  console.log('ERROR:', err);
  process.exit(1);
}

process.on('unhandledRejection', onUnhandledError);
process.on('uncaughtException', onUnhandledError);

const setupAppRoutes =
    process.env.NODE_ENV === 'development' ? require('./middlewares/development') : require('./middlewares/production');

const app = express();

app.set('env', process.env.NODE_ENV);

// Set up middleware
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
// app.use(function(req, res, next){
    // console.log("()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()");
    // console.log("()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()");
    // console.log("()()()()()()()()()()()()()()()()()()()()()()()()()()()()()()");
    // console.log(req.path);
    // let validSession = req.cookies['haveagoodday'];
    // let validUser = req.cookies['user_id'];
    // let session = false;
    // console.log(validSession);
    // if ( isNaN(validSession) ) {
    //     if (validSession && validUser) {
    //         if (hashFunc(validUser + 'logged_id') === validSession) {
    //             session = true;
    //         }
    //     }
    // }
    // console.log("session validity : " +session);
    //
    // if (session &&  ( req.path === "/gogo" ) ) {
    //     console.log(req.path);
    //     console.log("going to gogo");
    //     next();
    //     return;
    // } else if (!session &&  ( req.path === "/gogo" )) {
    //     console.log("redirect to login");
    //     res.redirect('./login');
    //     return;
    // }
// });



// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

require('./routes')(app, db);

// application routes (this goes last)
setupAppRoutes(app);

http.createServer(app).listen(process.env.PORT, () => {
    console.log(`HTTP server is now running on http://localhost:${process.env.PORT}`);
});
