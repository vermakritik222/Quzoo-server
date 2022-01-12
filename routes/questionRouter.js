const express = require('express');
const questionControllers = require('../controllers/questionController');
const authController = require('../controllers/AuthenticationController');

const router = express.Router();

router.post('/post/questionpaper', questionControllers.postAll);
router.get('/questionpaper/:setcode', questionControllers.getQuestionPaper);

module.exports = router;
