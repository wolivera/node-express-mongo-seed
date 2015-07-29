var config = {};

config.secret = "jdZKYKwfTw9D9YMr";

config.server = {
	host: process.env.SERVER_HOST || 'localhost',
	port: process.env.SERVER_PORT || 2791
};
config.db = {
	url: process.env.DATABASE_URL || 'localhost:27017/node-express-mongo-seed'
}

module.exports = config;