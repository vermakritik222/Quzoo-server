const { Router } = require('express');
const authController = require('../controllers/AuthenticationController');
const userController = require('../controllers/userController');

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch(
    '/updateMyPassword',
    authController.protect,
    authController.updatePassword
);

router.post('/postAns', authController.checkUser, userController.postAns);

module.exports = router;
