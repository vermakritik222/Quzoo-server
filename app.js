const express = require('express');
const userRouter = require('./routes/userRouter');
const questionRouter = require('./routes/questionRouter');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());

// cookieParser
app.use(cookieParser());

// Serving Static files
app.use(express.static(`${__dirname}/public`));

// Sending time
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString;
    next();
});

const coresOptions = {
    credentials: true,
    origin: ['http://localhost:3000/', 'http://127.0.0.1:3000'],
};
app.use(cors(coresOptions));

// main routes
app.use('/api/v1/questions', questionRouter);
app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
    console.log('page not found');
});

module.exports = app;
