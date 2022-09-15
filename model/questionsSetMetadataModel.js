const mongoose = require('mongoose');

const questionSetMetadataSchema = new mongoose.Schema({
    SetTitle: {
        type: String,
    },
    SetQuestionNumber: {
        type: Number,
    },
    SetDuration: {
        type: String,
    },
    SetTotalMarks: String,
    SetBackgroundImg: String,
    SetDescription: String,
    SetYear: {
        type: Number,
    },
});

const QuestionSetsMetadata = mongoose.model(
    'QuestionSetsMetadata',
    questionSetMetadataSchema
);

module.exports = QuestionSetsMetadata;
