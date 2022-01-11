const mongoose = require('mongoose');

const userDashboardSchema = new mongoose.Schema({
    userId: String,
    paperInfo: [
        {
            type: Object,
        },
    ],
    mathsTotal: { type: Number, default: 0 },
    phyTotal: { type: Number, default: 0 },
    cheTotal: { type: Number, default: 0 },
});

const userDashboard = mongoose.model('userDashboard', userDashboardSchema);

module.exports = userDashboard;
