const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const chtchasync = require('../util/chtchasync');
const User = require('../model/userModel');

exports.checkUser = chtchasync(async (req, res, next) => {
    // 1) getting token and check of its there
    let token;
    if (req.cookies !== null) {
        token = req.cookies.jwt;
    }

    // console.log(req.cookies.jwt);
    // if (
    //     req.headers.authorization &&
    //     req.headers.authorization.startsWith('Bearer')
    // ) {
    //     token = req.headers.authorization.split(' ')[1];
    // }

    if (!token) {
        return next(
            new AppError(
                'You are not longed in! Pleas log in to get access.',
                401
            )
        );
    }

    // 2) verification of token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) check if user still exists
    const user = await User.findById(decode.id);
    if (!user)
        next(
            new AppError(
                'The token belonged to this User is no longer exist.',
                401
            )
        );
    console.log(await user.changedPasswordAfter(decode.iat));

    // 4) check if user changed pas after the token was issued
    if (await user.changedPasswordAfter(decode.iat))
        next(
            new AppError(
                'User has changed there Password! please login again',
                401
            )
        );

    req.user = user;
    next();
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

    req.user = freshUser;
    next();
});
