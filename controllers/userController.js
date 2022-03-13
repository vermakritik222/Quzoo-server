const User = require('../model/userModel');
const QuestionSets = require('../model/questionsSetModel');
const userMetaData = require('../model/userMetadataModel');
const Dashboard = require('../model/userDashboardModel');
const chtchasync = require('../util/chtchasync');

exports.postAns = chtchasync(async (req, res, next) => {
    // (1) check weather user is logged in or not
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

    // (5) counting the number of correct ans
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
        data,
    });
});

exports.checkUserInfo = chtchasync(async (req, res, next) => {
    console.log(req.user._id, 'stage 1');
    const currentUserDashboard = await Dashboard.findOne({
        userId: req.user._id,
    });
    console.log(currentUserDashboard, 'stage 2');
    if (currentUserDashboard) {
        const paper = currentUserDashboard.paperInfo.find((el) => {
            if (el.paperInfo.setcode === req.params.setcode) {
                return el;
            }
        });
        console.log(req.params.setcode, 'req.params.setcode');
        console.log(
            currentUserDashboard.paperInfo[0].paperInfo.setcode,
            'req.params.setcode'
        );
        console.log(paper.subansId, 'stage 3');
        if (paper) {
            const data = await userMetaData.findById(paper.subansId);
            console.log(data, 'stage 4');
            res.status(200).json({
                status: 'success',
                data,
            });
        } else {
            console.log('document not found', 'stage 4 part 2');
            res.status(404).json({
                status: 'document not found',
            });
        }
    }
});

exports.getUserDashboard = chtchasync(async (req, res, next) => {
    const user = req.user;

    const userDash = await Dashboard.findOne({ userId: user._id });
    // console.log(user);
    res.json({
        status: 'success',
        data: userDash,
    });
});
