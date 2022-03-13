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

exports.verifyOnLode = chtchasync(async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token === null) {
        res.status(401).json({
            status: 'failed',
        });
        return;
    }

    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.id);
    if (!user)
        next(
            new AppError(
                'The token belonged to this User is no longer exist.',
                401
            )
        );

    if (await user.changedPasswordAfter(decode.iat))
        next(
            new AppError(
                'User has changed there Password! please login again',
                401
            )
        );

    const userData = {
        username: user.username,
        email: user.email,
        photo: user.photo,
    };

    res.status(200).json({
        status: 'success',
        user: userData,
    });
});
