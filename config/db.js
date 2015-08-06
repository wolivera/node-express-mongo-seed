var mongoose = require('mongoose');
var config = require('./config');

exports.connect = function() {

	var handleConnection = function() {
		console.log("Connecting to database " + config.db.url);
		mongoose.connect(config.db.url);
	};
	
	handleConnection();

	// Error handler
	mongoose.connection.on('error', function(err) {
		console.log(err);
	});

	// Reconnect when closed
	mongoose.connection.on('disconnected', function() {
		handleConnection();
	});

	// If the Node process ends, close the Mongoose connection
	process.on('SIGINT', function() {
		mongoose.connection.close(function () {
			console.log('Mongoose default connection disconnected through app termination');
			process.exit(0);
		});
	});
};

exports.sync = function(){
	require("../app/models/User");
}
