var mongoose 	= require( 'mongoose' );
var async 		= require('async');
var request 	= require('superagent');
var expect 		= require('chai').expect;
var cache 		= require('../utils/cacheHandler');
var config 		= require('../../config/config');
var uuid 		= require('node-uuid');
var app 		= require('../../app');

/*
 Set the database URL for TESTING
*/
var url = 'http://localhost:' + config.server.port;

config.db.url = 'mongodb://localhost:27017/node-express-mongo-seed-test';


describe('User Controller', function() {

	var User;

	var user, authToken;

	var userParams = {
      	email: "test2@test.com",
      	password: "test123",
      	firstName: "test",
      	lastName: "user"
	}

	before(function (done) {

		User = mongoose.model('User');

		async.waterfall([			
			function createTestUser(next){
				User.create(userParams, function (err, u){
					if(err) return next(err);
					user = u;
					next();
				});
			},
			function createToken(next){
				authToken = uuid.v4();
				var data = {
					userId : user._id,
					email  : user.email
				}				
				cache.set(authToken, data);
				next();
			}
		], 
		done);

	});

	after(function (done) {
		mongoose.connect(config.db.url, function(){
			mongoose.connection.db.dropDatabase(function(){
				done();
			})
		})

	});

	describe('.signup()', function() {

		it('should return 200 and a create a new user', function (done) {

			request
				.post(url + '/users')
				.set({})
				.send({
					email		: "test@test.com",
			      	password 	: "test123",
			      	firstName	: "test",
			      	lastName 	: "user"
				})
				.end(function (err, res){
			        expect(err).to.not.exist;
			        expect(res).to.exist;
			        expect(res.status).to.equal(200);
			        expect(res.body).to.be.not.empty;

			        var user = res.body.user;
			        expect(user).to.be.not.empty;
			        expect(user._id).to.exist;
			        expect(user.email).to.exist;
			        expect(user.firstName).to.exist;
			        expect(user.lastName).to.exist;

			        done();
		      	});
		});

		it('should return 400 and an error for missing parameters', function (done) {

			request
				.post(url + '/users')
				.set({})
				.send({
			      	password 	: "test123",
			      	firstName	: "test",
			      	lastName 	: "user"
				})
				.end(function (err, res){
			        expect(res).to.exist;
			        expect(res.status).to.equal(400);
			        expect(res.body.errors).to.exist;
			        expect(res.body.errors[0]).to.exist;
			        expect(res.body.errors[0].message).to.equal("Missing parameters");

			        done();
		      	});

		});

		it('should return 400 and an error for invalid email', function (done) {

			request
				.post(url + '/users')
				.set({})
				.send({
					email 		: "test@mail",
			      	password 	: "test123",
			      	firstName	: "test",
			      	lastName 	: "user"
				})
				.end(function (err, res){
			        expect(res).to.exist;
			        expect(res.status).to.equal(400);
			        expect(res.body.errors).to.exist;
			        expect(res.body.errors[0]).to.exist;
			        expect(res.body.errors[0].message).to.equal("Email format is incorrect");

			        done();
		      	});

		});

		it('should return 400 and an error for existing user', function (done) {

			request
				.post(url + '/users')
				.set({})
				.send({
					email 		: "test2@test.com",
			      	password 	: "test123",
			      	firstName	: "test",
			      	lastName 	: "user"
				})
				.end(function (err, res){
			        expect(res).to.exist;
			        expect(res.status).to.equal(400);
			        expect(res.body.errors).to.exist;
			        expect(res.body.errors[0]).to.exist;
			        expect(res.body.errors[0].message).to.equal("Email already in use");

			        done();
		      	});

		});

	});

});