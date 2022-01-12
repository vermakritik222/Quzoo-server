const chtchasync = require('../util/chtchasync');
const User = require('../model/userModel');
const QuestionSets = require('../model/questionsSetModel');
const userMetaData = require('../model/userMetadataModel');
const Dashboard = require('../model/userDashboardModel');

exports.postAns = chtchasync(async (req, res, next) => {
    // req.user._id = '61dee825b12b4126e41db3e5';
    // (1) check weather user is loged in or not
    if (!req.user._id) {
        next();
    }

    // (2) check weather ans are posted in an right way or not
    if (!req.body.map) {
        next();
    }

    // (3) get the question paper
    const doc = [];
    let iterator = 0;

    const questionPaper = await QuestionSets.find({
        SetCode: req.body.paperInfo.setcode,
    });

    // (4) validate the posted ans
    while (iterator < req.body.map.length) {
        if (req.body.map[iterator].sub === 'P') {
            for (
                let i = 0;
                i < questionPaper[0].Questions.PQuestions.length;
                i++
            ) {
                if (
                    questionPaper[0].Questions.PQuestions[i].qutions_id ===
                    req.body.map[iterator].Qid
                ) {
                    if (
                        questionPaper[0].Questions.PQuestions[i].correct__ans
                            .option_id === req.body.map[iterator].ans
                    ) {
                        req.body.map[iterator].correct__ans = true;
                        doc.push(req.body.map[iterator]);
                    } else {
                        req.body.map[iterator].correct__ans = false;
                        doc.push(req.body.map[iterator]);
                    }
                }
            }
        } else if (req.body.map[iterator].sub === 'C') {
            for (
                let i = 0;
                i < questionPaper[0].Questions.CQuestions.length;
                i++
            ) {
                if (
                    questionPaper[0].Questions.CQuestions[i].qutions_id ===
                    req.body.map[iterator].Qid
                ) {
                    if (
                        questionPaper[0].Questions.CQuestions[i].correct__ans
                            .option_id === req.body.map[iterator].ans
                    ) {
                        req.body.map[iterator].correct__ans = true;
                        doc.push(req.body.map[iterator]);
                    } else {
                        req.body.map[iterator].correct__ans = false;
                        doc.push(req.body.map[iterator]);
                    }
                }
            }
        } else if (req.body.map[iterator].sub === 'M') {
            {
                for (
                    let i = 0;
                    i < questionPaper[0].Questions.MQuestions.length;
                    i++
                ) {
                    if (
                        questionPaper[0].Questions.MQuestions[i].qutions_id ===
                        req.body.map[iterator].Qid
                    ) {
                        if (
                            questionPaper[0].Questions.MQuestions[i]
                                .correct__ans.option_id ===
                            req.body.map[iterator].ans
                        ) {
                            req.body.map[iterator].correct__ans = true;
                            doc.push(req.body.map[iterator]);
                        } else {
                            req.body.map[iterator].correct__ans = false;
                            doc.push(req.body.map[iterator]);
                        }
                    }
                }
            }
        }
        iterator++;
    }

    // (5) counting the nymber of currecet ans
    let total_phyQ = 0;
    let total_cheQ = 0;
    let total_mathsQ = 0;
    let phyQ_correct = 0;
    let cheQ_correct = 0;
    let mathsQ_correct = 0;

    for (let i = 0; i < doc.length; i++) {
        if (doc[i].sub === 'P') {
            total_phyQ++;
            doc[i].correct__ans && phyQ_correct++;
        } else if (doc[i].sub === 'C') {
            total_cheQ++;
            doc[i].correct__ans && cheQ_correct++;
        }
        if (doc[i].sub === 'M') {
            total_mathsQ++;
            doc[i].correct__ans && mathsQ_correct++;
        }
    }

    const data = {
        // userID: req.user._id,
        paperInfo: { ...req.body.paperInfo },
        QuizData: {
            total_phyQ,
            total_cheQ,
            total_mathsQ,
            phyQ_correct,
            cheQ_correct,
            mathsQ_correct,
        },
        doc,
    };

    // (6) save the posted ans
    const MetaData = await userMetaData.create({
        user: req.user._id,
        document: data,
    });

    // (7) update the Dashboard
    const userDashboard = await Dashboard.findOne({ userId: req.user._id });

    if (userDashboard) {
        const paperdash = {
            paperInfo: { ...req.body.paperInfo },
            QuizData: {
                total_phyQ,
                total_cheQ,
                total_mathsQ,
                phyQ_correct,
                cheQ_correct,
                mathsQ_correct,
            },
            subansId: MetaData._id,
        };
        paperdash.total_marks = userDashboard.paperInfo.push(paperdash);

        userDashboard.mathsTotal +=
            mathsQ_correct * 4 - (total_mathsQ - mathsQ_correct);
        userDashboard.phyTotal +=
            phyQ_correct * 4 - (total_phyQ - phyQ_correct);
        userDashboard.cheTotal +=
            cheQ_correct * 4 - (total_cheQ - cheQ_correct);

        await userDashboard.save();
    } else {
        // next(new AppError())
        console.log('user nahi h <<<<questionController.js<<<line 257>>>> ');
    }

    // (8) send the result
    res.status(200).json({
        status: 'success',
        data: data,
    });
});
