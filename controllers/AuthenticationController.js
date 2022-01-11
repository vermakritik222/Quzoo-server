const User = require('../model/userModel');
const UserDashboard = require('../model/userDashboardModel');
const jwt = require('jsonwebtoken');
const chtchasync = require('../util/chtchasync');
const AppError = require('../util/appError');
const { promisify } = require('util');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const creatSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        // httpOnly: true,
    };

    if (
        process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'development'
    ) {
        // cookieOptions.secure = true;
        res.status(statusCode).cookie('jwt', token, cookieOptions).json({
            status: 'success',
            token,
        });
    }

    // res.status(statusCode).json({
    //     status: 'success',
    //     token,
    // });
};

exports.signup = chtchasync(async (req, res, next) => {
    const user = await User.create(req.body);
    await UserDashboard.create({ userId: user._id });
    creatSendToken(user, 201, res);
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
    creatSendToken(user, 202, res);
});

exports.protect = chtchasync(async (req, res, next) => {
    // 1) getting token and check of its there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);

    if (!token) {
        return next(
            new AppError(
                'You are not logged in! Pleas log in to get access.',
                401
            )
        );
    }
    // 2) verification of token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) check if user still exists
    const freshUser = await User.findById(decode.id);
    if (!freshUser) {
        return next(
            new AppError(
                'The token belonged to this User is no longer exist.',
                401
            )
        );
    }

    // 4) check if user changed pas after the token was issued
    if (freshUser.changedPasswordAfter(decode.iat)) {
        return next(
            new AppError(
                'User has changed there Password! please login again',
                401
            )
        );
    }
    // Greant acces to protected rout
    req.user = freshUser;
    next();
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
    creatSendToken(user, 200, res);
});
