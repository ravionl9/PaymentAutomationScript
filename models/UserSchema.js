const mongoose = require('mongoose');
const schema = mongoose.Schema;

const user_schema = new schema({
    username: { type: String, default: '' },
    password: { type: String, default: '' }
}, {
    timestamps: true
});

const Users = mongoose.model('users', user_schema);

module.exports = {
    Users
};