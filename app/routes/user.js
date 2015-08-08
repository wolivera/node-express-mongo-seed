var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/user');

/*
	Users routes (host:port/users/)
*/

router.post('/', userCtrl.signup);

router.post('/login', userCtrl.login);

router.post('/logout', userCtrl.logout);


module.exports = router;