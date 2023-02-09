const UserController = require('../controllers/UserController');
var express = require('express');
var router = express.Router();


// créer un compte utilisateur
router.post('/signup', UserController.signup);

// se connecter a lapplication
router.post('/login', UserController.login);


module.exports = router