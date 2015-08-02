var config = require('../../config/config');
var redis  = require('redis');

exports.get = function(key, done){

	getClient().get(key, done);	
}

exports.set = function(key, value){

	getClient().set(key, value, redis.print);
}

exports.del = function(key, done){

	var cli = getClient();

	cli.get(key, function (err, u){
		if(err){ return done(err); }
		
		cli.del(key);
		done();
	});
}

function getClient(){
	return redis.createClient(config.redis.port,config.redis.host, {});
}