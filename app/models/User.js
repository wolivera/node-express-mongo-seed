var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;
var bcrypt 		= require('bcrypt');
var uuid 		= require('node-uuid');

var UserSchema = new Schema({	
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	timeCreated: {
		type: Date,
		default: Date.now
	}
});

UserSchema.methods = {

	createSession : function(done){
		var token = uuid.v4();
		var data = {
			userId : this._id,
			email  : this.email
		}
		done(token);		
	}
};

UserSchema.statics = {


	signup : function(params, done){

		var User = this;

		async.waterfall([
			function validateEmailFormat(next){
				var isValid = utilities.validateEmail(params.email);
				if(!isValid){
					var err = {
            			status  : 400,
            			message : "Email format is incorrect"
					}
					return next(err);
				}
				next();
			},
			function validateUniqueEmail(next){
				User.count({ 'email': params.email }, function (err, count) {
                	if (err) return next(err);

                	if(count){
                		var err = {
                			status  : 400,
                			message : "Email already in use"
                		}                		
                	}
                	next(err);
                });
			},
			function hashPassword(next){
				bcrypt.genSalt(10, function(err, salt) {
		            if (err) return next(err);

		            bcrypt.hash(params.password, salt, next);
		        });
			},
			function createUser(hash, next){
				params.password = hash;

				User.create({
					email 		: params.email,
					password 	: params.password,
					firstName 	: params.firstName,
					lastName 	: params.lastName,
				},
				next);
			}
		], 
		done);
	},

	login : function(params, done){

		var User = this;

		async.waterfall([		

			function validateExists(next){
				User.findOne({'email': params.email}, function (err, user){
                	if (err) return next(err);

                	if(!user){
                		var err = {
                			status  : 404,
                			message : "User does not exist"
                		}                		
                	}

                	next(err, user);
                });
			},
			function validatePassword(user, next){

				bcrypt.compare(params.password, user.password, function(err, isMatch) {
					if (err) return next(err);

					if(!isMatch){
                		var err = {
                			status  : 404,
                			message : "Invalid password"
                		}                		
                	}
                	delete user.password;

                	next(err, user);
				});
			}
		], 
		function (err, user){
			if(err) return handleError(err, done);

			done(null, user);
		})
	},

	logout : function(token, done){
		cache.del(token, done);
	}
}

module.exports = mongoose.model('User', UserSchema);