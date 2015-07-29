var mongoose = require('mongoose');


exports.connect = function() {

	var handleConnection = function() {
		console.log("Connecting to database " + config.db.url);
		mongoose.connect(config.db.url);
	};
	
	handleConnection();
};