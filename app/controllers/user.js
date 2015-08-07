var constants 	= require('../utils/constants');
var cache 		= require('../utils/cacheHandler');
var async		= require('async');
var User 		= require('../models/User');

exports.validateSession = function(req, res, next){

	if(isPublicMethod(req.path)){
		return next();
	}

	var token = req.headers[constants.AUTH_TOKEN];

	cache.get(token, function (err, user){
		
		if (err) return handleError(res, err);

		if (!user) {
			return handleError(res, {
				status: 401,
				message: 'Unauthorized user. Please login and try again.'
			})
		}
		req.user = user;
		next();
	})

	function isPublicMethod(path){
		var publicMethods = [
			'/swagger',
			'/users',
			'/users/login'
		]
		return publicMethods.indexOf(path) !== -1;
	}
}

exports.signup = function(req, res){
	console.log('user.signup');

	var email 		 	= req.body.email;
  	var firstName 	 	= req.body.firstName;
  	var lastName	 	= req.body.lastName;
  	var password 	 	= req.body.password;

  	if (!email || !firstName || !lastName || !password){
		return handleError(res, {
			status: 400,
			message: 'Missing parameters'
		})	
	}
	var params = {
		email		: email,
		firstName	: firstName,
		lastName	: lastName,
		password 	: password
	}

	async.waterfall([

		function createUser(next){
			User.signup(params, next);
		},
		function createSession(user, next){
			user.createSession(function (token){
				res.setHeader(constants.AUTH_TOKEN, token);//add as header
				next(null, user);
			})
		}
	],
	function (err, user){
		if(err) return handleError(res, err); 

		res.json({
			user: user
		});
	})
	
}

exports.login = function(req, res){
	console.log('user.login');

	var email 		 	= req.body.email;
  	var password 	 	= req.body.password;

  	if (!email || !password){
		return handleError(res, {
			status: 400,
			message: 'Missing parameters'
		})	
	}
	var params = {
		email		: email,
		password 	: password
	}

	async.waterfall([

		function findUser(next){
			User.login(params, next);
		},
		function createSession(user, next){
			user.createSession(function (token){
				res.setHeader(constants.AUTH_TOKEN, token);//add as header
				next(null, user);
			})
		}
	],
	function (err, user){
		if(err) return handleError(res, err); 

		res.json({
			user: user
		});
	})
}

exports.logout = function(req, res)	{
	var token = req.headers[constants.AUTH_TOKEN];

	User.logout(token, function (err){
		if(err) return handleError(res, err); 

		res.json({});
	})
};

function handleError(res, err){
	var status = err.status || 500;
	res.status(status);
	return res.json({
		errors: [err]
	});
};