var config = require('./config/config');
var server = require('./config/server');
var router = require('./router');
var db = require('./config/db');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');

var app = express();
/*
	DB Connection
*/
db.connect();
db.sync();

/*
	App Config
*/
server.config(app);

/*
	API Routing
*/
router.route(app);

/*
	Start server
*/
app.set('port', config.server.port);

app.listen(app.get('port'), function() {
	console.log('Server listenting on ' + process.pid + " and port " + app.get('port'));
});

// export app so we can test it
exports = module.exports = app;
