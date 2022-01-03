const requestIP = require('request-ip');
const Users = require('../models/UserSchema').Users;
const Model = require('../models/Model');
const Auth = require('../models/AuthenticationSchema').Auth;
const AuthToken = require('../auth');
const bcrypt = require('bcrypt');

class UserController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async login() {
        try {
            let bodyData = this.req.body;

            console.log(bodyData);

            let username = bodyData.username;
            let password = bodyData.password;

            let existFind = await Users.find({ username: username });

            if (existFind.length == 0) {
                return this.res.send({ status: 0, message: 'username incorrect!!' });
            } else {
                let alreadyLogin = await Auth.find({ status: true });
                if (alreadyLogin.length != 0) {
                    return this.res.send({ status: 2, message: 'another session is already active somewhere else.' });
                } else {
                    if (bcrypt.compareSync(password, existFind[0].password)) {
                        let token = AuthToken.signToken(existFind[0].id);

                        let auth = {
                            token: token,
                            ip_address: getClientIp(this.req),
                            status: true
                        };

                        let saveAuth = await new Model(Auth).store(auth);

                        if (saveAuth != null) {
                            return this.res.send({ status: 1, message: 'login success!!', token: token });
                        }
                    } else {
                        return this.res.send({ status: 0, message: 'incorrect password!!' });
                    }
                }
            }
        } catch (error) {
            console.log(error);
            return this.res.send({ status: 0, message: 'Some error occoured. Please try again later.' });
        }
    }

    async logout() {
        try {
            let bodyData = this.req.body;

            let token = bodyData.token;

            let logoutResponse = await Auth.updateOne({ token: token }, { status: false });

            if (logoutResponse != null) {
                return this.res.send({ status: 1, message: 'logout successfull' });
            }
        } catch (error) {
            console.log(error);
            return this.res.send({ status: 0, message: 'some error occoured. please try again later.' });
        }
    }
}

async function hash(password) {
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    return hash;
}

function getClientIp(req) {
    let ipAddress;
    let forwardedIpsStr = req.header('x-forwarded-for');
    if (forwardedIpsStr) {
        let forwardedIps = forwardedIpsStr.split(',');
        console.log(forwardedIps);
        ipAddress = forwardedIps[0];
    }
    if (!ipAddress) {
        ipAddress = req.connection.remoteAddress;
    }
    return ipAddress;
};

module.exports = UserController;