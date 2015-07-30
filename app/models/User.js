var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;
var bcrypt 		= require('bcrypt');

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
				
	}
};



UserSchema.statics = {


	signup : function(params, done){

		var User = this;

		async.waterfall([			
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
	}
}

module.exports = mongoose.model('User', UserSchema);