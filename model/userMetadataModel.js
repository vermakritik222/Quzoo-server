const mongoose = require('mongoose');

const userMetadataSchema = new mongoose.Schema({
    user: {
        type: String,
        require: true,
    },
    date: {
        type: Date,
        default: new Date(),
    },
    document: [
        {
            type: Object,
            require: true,
        },
    ],
});

const UserMetadata = mongoose.model('UserMetadata', userMetadataSchema);

module.exports = UserMetadata;
