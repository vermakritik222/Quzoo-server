const { Router } = require('express');
const authController = require('../controllers/AuthenticationController');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch(
    '/updateMyPassword',
    authMiddleware.protect,
    authController.updatePassword
);

router.post('/postAns', authMiddleware.checkUser, userController.postAns);
router.get(
    '/info/papers/:setcode',
    authMiddleware.checkUser,
    userController.checkUserInfo
);

module.exports = router;
