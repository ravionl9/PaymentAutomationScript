const mongoose = require('mongoose');
const schema = mongoose.Schema;

const auth_schema = new schema({
    token: { type: String, default: '' },
    ip_address: { type: String, default: '' },
    status: { type: Boolean, default: false }
}, {
    timestamps: true
});

const Auth = mongoose.model('auth', auth_schema);

module.exports = {
    Auth
};