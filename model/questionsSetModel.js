const mongoose = require('mongoose');

const questionSetSchema = new mongoose.Schema({
    SetTitle: {
        type: String,
    },
    SetQuestionNumber: {
        type: Number,
    },
    SetDuration: {
        type: String,
    },
    SetCode: {
        type: Number,
    },
    Questions: {
        type: Object,
    },
});

const QuestionSets = mongoose.model('QuestionSets', questionSetSchema);

module.exports = QuestionSets;
