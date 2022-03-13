require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
    })
    .then(() => {
        console.log('DB is connected to app.....');
    })
    .catch((err) => {
        console.log(`db error ${err.message}`);
    });

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server is running on ${port} .......`);
});
