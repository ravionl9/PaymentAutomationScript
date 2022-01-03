const Form = require('../Form');
const script = require('../script');
const fs = require('fs').promises;
const path = require('path');

class ScriptController {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async startScript() {
        try {
            let form = new Form(this.req);
            let formData = await form.parse();
            let formFilelds = formData.fields;
            let formFiles = formData.files;
            let filePath = formFiles.excelfile[0].path;
            let corpID = formFilelds.corpid[0];
            console.log(corpID);
            script.automate(filePath, corpID);
            await new Promise(r => setTimeout(r, 120000));
            // let resultFilePath = path.join(__dirname, '..', 'result.xlsx');
            // console.log(resultFilePath);
            // // return this.res.sendFile(resultFilePath);
            // let resultFileData = await fs.readFile(resultFilePath);

            // this.res.setHeader('Content-Disposition', "attachment: filename='result.xlsx'");
            // this.res.setHeader('Content-Type', "application/vnd.ms-excel");
            return this.res.send({ status: 1, message: 'file available!!', url: 'http://13.233.209.117:7800/public/result.xlsx' });
        } catch (error) {
            console.log('in catch block');
            console.log(error);
            return this.res.send({ status: 0, message: 'some error occoured. please try again later.' });
        }
    }
}

module.exports = ScriptController;