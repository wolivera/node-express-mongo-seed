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


	signup : function(params, done){}
}

module.exports = mongoose.model('User', UserSchema);