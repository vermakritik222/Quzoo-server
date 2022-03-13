const jwt = require('jsonwebtoken');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

exports.creatSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        // httpOnly: true,
    };

    const userData = {
        username: user.username,
        email: user.email,
        photo: user.photo,
    };

    if (
        process.env.NODE_ENV === 'production' ||
        process.env.NODE_ENV === 'development'
    ) {
        res.status(statusCode).cookie('jwt', token, cookieOptions).json({
            status: 'success',
            // token,
            user: userData,
        });
    }
};
