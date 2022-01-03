class Constants {
    static get DB_URL() {
        return 'mongodb+srv://Admin:Admin2011@jakfruit-cluster.hxvvc.mongodb.net/SbiScript?retryWrites=true&w=majority';
    }

    static get JWT_KEY() {
        return 'jwtkey';
    }
}

module.exports = Constants;