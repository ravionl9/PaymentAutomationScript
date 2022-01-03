const jwt = require('jsonwebtoken');
const Constants = require('./Constants');

exports.signToken = function (userID) {
    const token = jwt.sign({ user_id: userID }, Constants.JWT_KEY);
    return token;
}