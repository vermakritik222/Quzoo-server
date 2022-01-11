const { Router } = require('express');
const authController = require('../controllers/AuthenticationController');

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch(
    '/updateMyPassword',
    authController.protect,
    authController.updatePassword
);
module.exports = router;
