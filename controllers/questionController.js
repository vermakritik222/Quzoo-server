const { v4: uuidv4 } = require('uuid');
const chtchasync = require('../util/chtchasync');
const QuestionSets = require('../model/questionsSetModel');

exports.postAll = chtchasync(async (req, res, next) => {
    // (1) get the data from user and add the uuid's in qutions and options
    for (let i = 0; i < req.body.Questions.CQuestions.length; i++) {
        req.body.Questions.CQuestions[i].qutions_id = uuidv4();

        for (
            let j = 0;
            j < req.body.Questions.CQuestions[i].options.length;
            j++
        ) {
            req.body.Questions.CQuestions[i].options[j].option_id = uuidv4();
            if (req.body.Questions.CQuestions[i].options[j].option__correct) {
                req.body.Questions.CQuestions[i].correct__ans =
                    req.body.Questions.CQuestions[i].options[j];
            }
        }
    }
    for (let i = 0; i < req.body.Questions.PQuestions.length; i++) {
        req.body.Questions.PQuestions[i].qutions_id = uuidv4();

        for (
            let j = 0;
            j < req.body.Questions.PQuestions[i].options.length;
            j++
        ) {
            req.body.Questions.PQuestions[i].options[j].option_id = uuidv4();
            if (req.body.Questions.PQuestions[i].options[j].option__correct) {
                req.body.Questions.PQuestions[i].correct__ans =
                    req.body.Questions.PQuestions[i].options[j];
            }
        }
    }

    for (let i = 0; i < req.body.Questions.MQuestions.length; i++) {
        req.body.Questions.MQuestions[i].qutions_id = uuidv4();
        for (
            let j = 0;
            j < req.body.Questions.MQuestions[i].options.length;
            j++
        ) {
            req.body.Questions.MQuestions[i].options[j].option_id = uuidv4();
            if (req.body.Questions.MQuestions[i].options[j].option__correct) {
                req.body.Questions.MQuestions[i].correct__ans =
                    req.body.Questions.MQuestions[i].options[j];
            }
        }
    }

    const doc = await QuestionSets.create(req.body);
    // (2) send the data to  responce
    res.status(200).json({
        status: 'success',
        data: doc,
    });
});

exports.getQuestionPaper = chtchasync(async (req, res, next) => {
    const data = await QuestionSets.find({ SetCode: req.params.setcode });
    res.status(200).json({
        status: 'success',
        data,
    });
});
