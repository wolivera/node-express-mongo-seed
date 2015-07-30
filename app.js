var config = require('./config/config.js');
var express = require('express');

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
app.set('port', (process.env.PORT || 2791));

app.listen(app.get('port'), function() {
	console.log('Server listenting on ' + process.pid + " and port " + app.get('port'));
});

exports = module.exports = app;
