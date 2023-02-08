var express = require('express');
var router = express.Router();

const authController = require('../controllers/authController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/resetPassword', authController.resetPassword);
router.post('/forgotPassword', authController.forgotPassword);
router.get('/resetPassword/:rememberToken', authController.forgotResetUrl);

module.exports = router;
