const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, 'enter an username'],
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        require: [true, 'enter an email'],
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    photo: String,
    password: {
        type: String,
        minlength: [6, 'A password must have 6 characters'],
        select: false,
        require: [true, 'enter an role'],
    },
    passwordConformation: {
        type: String,
        require: [true, 'please conform password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'password are not same',
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConformation = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    userPassword,
    candidatePassword
) {
    return await bcrypt.compare(userPassword, candidatePassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamps = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamps;
    }
    return false;
};

userSchema.methods.creatPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex'); // hex convert number to hexadecimal

    // sha256 is an algorithms to has resetToken
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log(resetToken, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
