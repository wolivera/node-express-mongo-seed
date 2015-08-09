var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var router = express.Router();
var config = require('./config');

/*
 	App configuration
*/

exports.config = function(app){
	app.use(express.static(__dirname + '/public'));
	app.set('port', config.server.port);
	app.use(cookieParser());	
	app.use(bodyParser.json());
}