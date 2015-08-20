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
	app.use(session({
		secret: 'node-express-mongo-seed-secret',
		saveUninitialized: true,
		resave: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(flash());
}