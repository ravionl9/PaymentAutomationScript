const mongoose = require('mongoose');
const Constants = require('./Constants');

module.exports = function () {
    let db = mongoose.connect(Constants.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    }).then(() => {
        console.log('database connected!!');
    });

    return db;
}