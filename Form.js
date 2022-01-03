const { PromiseProvider } = require('mongoose');
const multiparty = require('multiparty');

class Form {
    constructor(request) {
        this.request = request;
    }

    parse() {
        return new Promise((resolve, reject) => {
            let form = new multiparty.Form();
            form.parse(this.request, (err, fields, files) => {
                if (err) {
                    reject(err);
                } else {
                    let formParseObj = {};
                    formParseObj.fields = fields;
                    formParseObj.files = files;
                    resolve(formParseObj);
                }
            });
        });
    }
}

module.exports = Form;