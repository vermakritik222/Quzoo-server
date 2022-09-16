const express = require('express');
const userRouter = require('./routes/userRouter');
const questionRouter = require('./routes/questionRouter');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const universalMiddleware = require('./middlewares/universalMiddleware');

const app = express();

// JSON Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Serving Static files
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/build`));

// Middleware
app.use(universalMiddleware.sendTimeStamp);

// cors policies
const coresOptions = {
    credentials: true,
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
};
app.use(cors(coresOptions));

app.get('/', (req, res) => {
    // res.sendFile()
    res.sendFile('build/index.html', { root: __dirname });
});
// Routes
app.use('/api/v1/questions', questionRouter);
app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
    console.log('page not found');
});

module.exports = app;
