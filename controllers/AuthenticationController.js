const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const UserDashboard = require('../model/userDashboardModel');
const tokenServices = require('../services/tokenService');
const AppError = require('../util/appError');
const chtchasync = require('../util/chtchasync');

exports.signup = chtchasync(async (req, res, next) => {
    const user = await User.create(req.body);
    await UserDashboard.create({ userId: user._id });
    tokenServices.creatSendToken(user, 201, res);
});

exports.login = chtchasync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
        return next(new AppError('please enter password and user name', 404));

    const user = await User.findOne({ email: req.body.email }).select(
        '+password'
    );

    if (!user || !user.correctPassword(password, user.password))
        return next(new AppError('Incurrent email or password'));
    tokenServices.creatSendToken(user, 202, res);
});

exports.updatePassword = chtchasync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('password');
    //  check if POSTed current password is correct
    if (!user.correctPassword(user.password, req.body.currentPassword)) {
        next(new AppError('Your current password is wrong', 401));
    }
    // if so update password
    user.password = req.body.Password;
    user.passwordConformation = req.body.passwordConformation;
    await user.save();
    // log user in send jwt
    tokenServices.creatSendToken(user, 200, res);
});
