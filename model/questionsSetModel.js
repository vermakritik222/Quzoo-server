const mongoose = require('mongoose');
const QuestionSetsMetadata = require('../model/questionsSetMetadataModel');

const questionSetSchema = new mongoose.Schema(
    {
        Metadata: {
            type: mongoose.Schema.ObjectId,
            ref: 'QuestionSetsMetadata',
        },
        SetCode: {
            type: Number,
        },
        Questions: {
            type: Object,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);
questionSetSchema.pre(/^find/, function (next) {
    this.populate({ path: 'Metadata' });
    next();
});

const QuestionSets = mongoose.model('QuestionSets', questionSetSchema);

module.exports = QuestionSets;
