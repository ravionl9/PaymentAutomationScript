const puppeteer = require('puppeteer');
const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const excelToJson = require('convert-excel-to-json');
const json2xls = require('json2xls');

exports.automate = async (filePath, corpID) => {
    try {
        const result = excelToJson({
            sourceFile: filePath
        });

        console.log(result);

        let breakReason;
        let errorLabel;

        let responseArray = [];

        sharp.cache(false);

        console.log('...........script started...........');

        // (async () => {
        for (let i = 1; i <= result.Sheet1.length - 1; i++) {
            let element = result.Sheet1[i];
            console.log('launching headless chrome.....');
            const browser = await puppeteer.launch({
                args: ["--no-sandbox", "--disabled-setupid-sandbox"],
            });
            console.log('creating new page.....');
            const page = await browser.newPage();
            console.log('opening website.....');
            await page.goto(`https://www.onlinesbi.com/sbicollect/icollecthome.htm?corpID=${corpID}`);
            console.log('clicking on checkbox.....');
            await page.click('#proceedcheck_english', { clickCount: 1 });
            console.log('clicking on proceed button.....');
            await page.click('.btn', { clickCount: 1 });

            console.log('navigating to service selection page.....');
            await page.waitForNavigation();

            console.log('selecting services.....');
            await page.evaluate(() => {
                document.getElementsByClassName('btn dropdown-toggle btn-default')[0].click()
                document.querySelector('.dropdown-menu.inner').children[1].children[0].click()
            });

            console.log('navigating to details page.....');
            await page.waitForNavigation();

            console.log('filling name.....');
            await page.type('#outref11', element.B.toString());
            console.log('filling amount.....');
            await page.type('#outref12', element.D.toString());
            console.log('filling remarks.....');
            await page.type('#transactionRemarks', 'Payment');
            console.log('filling name.....');
            await page.type('#cusName', element.B.toString());
            console.log('filling date of birth.....');
            let dob = formatDate(element.E);
            await page.evaluate((dob) => {
                document.getElementById('dateOfBirth').value = dob;
            }, dob);
            // await page.type('#dateOfBirth', dob);
            console.log('filling mobile number.....');
            await page.type('#mobileNo', element.C.toString());
            // console.log('filling email.....');
            // await page.type('#emailId', element.F.toString());

            await solveFirstCpatcha(page);

            // console.log('solving captcha|=|_|=|');
            // await page.screenshot({ path: 'page.png' });

            // await sharp('page.png', { greyscale: true }).extract({ top: 462, left: 432, width: 95, height: 31 }).toFile('captcha.png');

            // let captchaOCRParseData = await Tesseract.recognize('captcha.png', 'eng');
            // let captchaCode = captchaOCRParseData.data.text;

            // console.log('captcha solved.....');
            // await page.type('#captchaValue', captchaCode);

            // console.log('clicking submit button.....');
            // await page.click('#frmFeeParams > div.home_btn > button:nth-child(1)', { clickCount: 1 });

            console.log('navigating to collect page.....');
            await page.waitForNavigation();

            console.log('clicking on submit.....');
            await page.click('#collect > div.home_btn > button:nth-child(1)', { clickCount: 1 });

            console.log('navigating to payment methods page.....');
            await page.waitForNavigation();

            console.log('clicking on rupay.....');
            await page.click('#payment > div:nth-child(2) > div > div:nth-child(3) > div > a', { clickCount: 1 });

            console.log('navigation to payment page.....');
            await page.waitForNavigation();

            errorLabel = await page.evaluate(() => {
                return new Promise((resolve, reject) => {
                    let erLbl = document.querySelector('#cardCaptchaMsg');
                    if (!erLbl) {
                        reject('element not found');
                    } else {
                        resolve(erLbl);
                    }
                });
            });

            // let name = "Gajendra sharma";

            xyz(page, browser, element);

            // for (; errorLabel != undefined; errorLabel = await setErrorLabel(page)) {
            // await page.screenshot({ path: 'payment.png' });
            // console.log('filling card number.....');
            // await page.type('#cardNumber', '8172450243368877');
            // console.log('selecting expiry month.....');
            // await page.select('#expMnthSelect', '8');
            // console.log('selecting expiery year.....');
            // await page.select('#expYearSelect', '2022');
            // console.log('filling card holder name.....');
            // await page.type('#cardholderName', name.toString());
            // console.log('filling cvv.....');
            // await page.evaluate(() => {
            //     document.getElementById('cvd2').value = '735';
            //     // document.querySelector('#cardCvv', '735');
            // });
            // // await page.type('#cvd2', '735');
            // // await page.type('#cardCvv', '735');

            // console.log('solving captcha|=|_|=|');
            // await sharp('payment.png').extract({ top: 475, left: 276, width: 73, height: 22 }).greyscale().toFile('paymentCaptcha.png');
            // let paymentCpatchaOCRData = await Tesseract.recognize('paymentCaptcha.png', 'eng');
            // let paymentCaptchaCode = paymentCpatchaOCRData.data.text;
            // paymentCaptchaCode.replace(' ', '');
            // paymentCaptchaCode.toUpperCase();
            // console.log(paymentCaptchaCode);

            // await page.type('#passline', 'paymentCaptchaCode');
            // console.log('clicking proceed.....');
            // await page.click('#proceed_button', { clickCount: 1 });


            // }

            // while (errorLabel) {

            //     // errorLabel = await page.evaluate(() => {
            //     //     return new Promise((resolve, reject) => {
            //     //         let erLbl = document.querySelector('#cardCaptchaMsg');
            //     //         if (!erLbl) {
            //     //             reject('element not found');
            //     //         } else {
            //     //             resolve(erLbl);
            //     //         }
            //     //     });
            //     // });

            //     await page.screenshot({ path: 'payment.png' });
            //     console.log('filling card number.....');
            //     await page.type('#cardNumber', '8172450243368877');
            //     console.log('selecting expiry month.....');
            //     await page.select('#expMnthSelect', '8');
            //     console.log('selecting expiery year.....');
            //     await page.select('#expYearSelect', '2022');
            //     console.log('filling card holder name.....');
            //     await page.type('#cardholderName', name.toString());
            //     console.log('filling cvv.....');
            //     await page.evaluate(() => {
            //         document.getElementById('cvd2').value = '735';
            //         // document.querySelector('#cardCvv', '735');
            //     });
            //     // await page.type('#cvd2', '735');
            //     // await page.type('#cardCvv', '735');

            //     console.log('solving captcha|=|_|=|');
            //     await sharp('payment.png').extract({ top: 475, left: 276, width: 73, height: 22 }).greyscale().toFile('paymentCaptcha.png');
            //     let paymentCpatchaOCRData = await Tesseract.recognize('paymentCaptcha.png', 'eng');
            //     let paymentCaptchaCode = paymentCpatchaOCRData.data.text;
            //     console.log(paymentCaptchaCode);

            //     await page.type('#passline', paymentCaptchaCode);
            //     console.log('clicking proceed.....');
            //     await page.click('#proceed_button', { clickCount: 1 });

            //     console.log('navigating to pin number page.....');
            //     await page.waitForNavigation();

            //     console.log('below navigation!!');

            //     console.log('under error label null!');
            //     if (await page.$('#cardCaptchaMsg') == null || errorLabel.innerText == 'Please enter valid card number') {
            //         if (errorLabel.innerText == 'Please enter valid card number') {
            //             breakReason = 'Card number invalid';
            //         }
            //         errorLabel = null;
            //         break;
            //     } else {
            //         console.log('invalid captcha retrying.....');
            //     }
            // }


            // {


            // if (!errorLabel || errorLabel.innerText == 'Please enter valid card number') {

            // }
            // }
            // let name = "Gajendra sharma";

            // await page.screenshot({ path: 'payment.png' });
            // console.log('filling card number.....');
            // await page.type('#cardNumber', '8172450243368877');
            // console.log('selecting expiry month.....');
            // await page.select('#expMnthSelect', '8');
            // console.log('selecting expiery year.....');
            // await page.select('#expYearSelect', '2022');
            // console.log('filling card holder name.....');
            // await page.type('#cardholderName', name.toString());
            // console.log('filling cvv.....');
            // await page.evaluate(() => {
            //     document.getElementById('cvd2').value = '735';
            //     // document.querySelector('#cardCvv', '735');
            // });
            // // await page.type('#cvd2', '735');
            // // await page.type('#cardCvv', '735');

            // console.log('solving captcha|=|_|=|');
            // await sharp('payment.png').extract({ top: 475, left: 276, width: 73, height: 22 }).greyscale().toFile('paymentCaptcha.png');
            // let paymentCpatchaOCRData = await Tesseract.recognize('paymentCaptcha.png', 'eng');
            // let paymentCaptchaCode = paymentCpatchaOCRData.data.text;
            // paymentCaptchaCode.replace(' ', '');
            // paymentCaptchaCode.toUpperCase();
            // console.log(paymentCaptchaCode);

            // await page.type('#passline', paymentCaptchaCode);
            // console.log('clicking proceed.....');
            // await page.click('#proceed_button', { clickCount: 1 });


            // await page.waitFor(2000);

            await page.waitForNavigation();

            let ipinelement = await page.$('#txtipin');

            if (breakReason) {
                let responseJson = {
                    'name': element.B.toString(),
                    'mobile': element.C.toString(),
                    'amount': element.D.toString(),
                    'email': element.F.toString(),
                    'card_number': element.G.toString(),
                    'cvv': element.J.toString(),
                    'status': 'card number invalid',
                    'ref_number': ''
                };

                responseArray.push(responseJson);
            } else if (ipinelement) {
                console.log('filling ipin.....')
                // await page.evaluate((element) => {
                //     document.getElementById('txtipin').value = element.K.toString();
                // }, element);
                await page.type('#txtipin', element.K.toString());
                console.log('clicking on proceed.....');
                await page.click('#btnverify', { clickCount: 1 });

                console.log('paying.....');
                await page.waitForNavigation();

                console.log('on success page.....');

                let status = '';

                let failureDiv = await page.$('#collect > div.panel-collapse.alert.alert-danger');

                let successDiv = await page.$('#printdetailsformtop > div');

                let refNumber = '';

                if (failureDiv) {
                    status = 'Pending';
                    let refNumberElement = await page.$('#collect > div.panel-collapse.alert.alert-danger > div > div:nth-child(4) > span > strong');
                    refNumber = await page.evaluate(refNumberElement => refNumberElement.textContent, refNumberElement);
                } else if (successDiv) {
                    status = 'Success';
                    let refNumberElement = await page.$('#printdetailsformtop > div > div > div:nth-child(3) > span > strong');
                    refNumber = await page.evaluate(refNumberElement => refNumberElement.textContent, refNumberElement);
                }

                // let refNumberElement = await page.$('#collect > div.panel-collapse.alert.alert-danger > div > div:nth-child(4) > span > strong');
                // let refNumber = await page.evaluate(refNumberElement => refNumberElement.textContent, refNumberElement);
                console.log(refNumber);

                let responseJson = {
                    'name': element.B.toString(),
                    'mobile': element.C.toString(),
                    'amount': element.D.toString(),
                    'card_number': element.G.toString(),
                    'cvv': element.J.toString(),
                    'status': status,
                    'ref_number': refNumber.toString()
                };

                responseArray.push(responseJson);

                page.close();
                browser.close();
                fs.unlinkSync('captcha.png');
                fs.unlinkSync('page.png');
                fs.unlinkSync('payment.png');
                fs.unlinkSync('paymentCaptcha.png');
            }
        }

        let xls = json2xls(responseArray);

        let savePath = path.join(__dirname, 'public', 'result.xlsx');

        fs.writeFileSync(savePath, xls, 'binary');

        console.log('...........script finished...........')

    } catch (error) {
        console.log(error);
    }
    // })();
}

// const result = excelToJson({
//     sourceFile: 'records.xlsx'
// });

// console.log(result);

// let breakReason;
// let errorLabel;

// let responseArray = [];

// sharp.cache(false);

// console.log('...........script started...........');

// (async () => {
//     for (let i = 1; i <= result.Sheet1.length - 1; i++) {
//         let element = result.Sheet1[i];
//         console.log('launching headless chrome.....');
//         const browser = await puppeteer.launch({
//             headless: false
//         });
//         console.log('creating new page.....');
//         const page = await browser.newPage();
//         console.log('opening website.....');
//         await page.goto('https://www.onlinesbi.com/sbicollect/icollecthome.htm?corpID=3690757');
//         console.log('clicking on checkbox.....');
//         await page.click('#proceedcheck_english', { clickCount: 1 });
//         console.log('clicking on proceed button.....');
//         await page.click('.btn', { clickCount: 1 });

//         console.log('navigating to service selection page.....');
//         await page.waitForNavigation();

//         console.log('selecting services.....');
//         await page.evaluate(() => {
//             document.getElementsByClassName('btn dropdown-toggle btn-default')[0].click()
//             document.querySelector('.dropdown-menu.inner').children[1].children[0].click()
//         });

//         console.log('navigating to details page.....');
//         await page.waitForNavigation();

//         console.log('filling name.....');
//         await page.type('#outref11', element.B.toString());
//         console.log('filling amount.....');
//         await page.type('#outref12', element.D.toString());
//         console.log('filling remarks.....');
//         await page.type('#transactionRemarks', 'Payment');
//         console.log('filling name.....');
//         await page.type('#cusName', element.B.toString());
//         console.log('filling date of birth.....');
//         let dob = formatDate(element.E);
//         await page.evaluate((dob) => {
//             document.getElementById('dateOfBirth').value = dob;
//         }, dob);
//         // await page.type('#dateOfBirth', dob);
//         console.log('filling mobile number.....');
//         await page.type('#mobileNo', element.C.toString());
//         // console.log('filling email.....');
//         // await page.type('#emailId', element.F.toString());

//         await solveFirstCpatcha(page);

//         // console.log('solving captcha|=|_|=|');
//         // await page.screenshot({ path: 'page.png' });

//         // await sharp('page.png', { greyscale: true }).extract({ top: 462, left: 432, width: 95, height: 31 }).toFile('captcha.png');

//         // let captchaOCRParseData = await Tesseract.recognize('captcha.png', 'eng');
//         // let captchaCode = captchaOCRParseData.data.text;

//         // console.log('captcha solved.....');
//         // await page.type('#captchaValue', captchaCode);

//         // console.log('clicking submit button.....');
//         // await page.click('#frmFeeParams > div.home_btn > button:nth-child(1)', { clickCount: 1 });

//         console.log('navigating to collect page.....');
//         await page.waitForNavigation();

//         console.log('clicking on submit.....');
//         await page.click('#collect > div.home_btn > button:nth-child(1)', { clickCount: 1 });

//         console.log('navigating to payment methods page.....');
//         await page.waitForNavigation();

//         console.log('clicking on rupay.....');
//         await page.click('#payment > div:nth-child(2) > div > div:nth-child(3) > div > a', { clickCount: 1 });

//         console.log('navigation to payment page.....');
//         await page.waitForNavigation();

//         errorLabel = await page.evaluate(() => {
//             return new Promise((resolve, reject) => {
//                 let erLbl = document.querySelector('#cardCaptchaMsg');
//                 if (!erLbl) {
//                     reject('element not found');
//                 } else {
//                     resolve(erLbl);
//                 }
//             });
//         });

//         // let name = "Gajendra sharma";

//         xyz(page, browser, element);

//         // for (; errorLabel != undefined; errorLabel = await setErrorLabel(page)) {
//         // await page.screenshot({ path: 'payment.png' });
//         // console.log('filling card number.....');
//         // await page.type('#cardNumber', '8172450243368877');
//         // console.log('selecting expiry month.....');
//         // await page.select('#expMnthSelect', '8');
//         // console.log('selecting expiery year.....');
//         // await page.select('#expYearSelect', '2022');
//         // console.log('filling card holder name.....');
//         // await page.type('#cardholderName', name.toString());
//         // console.log('filling cvv.....');
//         // await page.evaluate(() => {
//         //     document.getElementById('cvd2').value = '735';
//         //     // document.querySelector('#cardCvv', '735');
//         // });
//         // // await page.type('#cvd2', '735');
//         // // await page.type('#cardCvv', '735');

//         // console.log('solving captcha|=|_|=|');
//         // await sharp('payment.png').extract({ top: 475, left: 276, width: 73, height: 22 }).greyscale().toFile('paymentCaptcha.png');
//         // let paymentCpatchaOCRData = await Tesseract.recognize('paymentCaptcha.png', 'eng');
//         // let paymentCaptchaCode = paymentCpatchaOCRData.data.text;
//         // paymentCaptchaCode.replace(' ', '');
//         // paymentCaptchaCode.toUpperCase();
//         // console.log(paymentCaptchaCode);

//         // await page.type('#passline', 'paymentCaptchaCode');
//         // console.log('clicking proceed.....');
//         // await page.click('#proceed_button', { clickCount: 1 });


//         // }

//         // while (errorLabel) {

//         //     // errorLabel = await page.evaluate(() => {
//         //     //     return new Promise((resolve, reject) => {
//         //     //         let erLbl = document.querySelector('#cardCaptchaMsg');
//         //     //         if (!erLbl) {
//         //     //             reject('element not found');
//         //     //         } else {
//         //     //             resolve(erLbl);
//         //     //         }
//         //     //     });
//         //     // });

//         //     await page.screenshot({ path: 'payment.png' });
//         //     console.log('filling card number.....');
//         //     await page.type('#cardNumber', '8172450243368877');
//         //     console.log('selecting expiry month.....');
//         //     await page.select('#expMnthSelect', '8');
//         //     console.log('selecting expiery year.....');
//         //     await page.select('#expYearSelect', '2022');
//         //     console.log('filling card holder name.....');
//         //     await page.type('#cardholderName', name.toString());
//         //     console.log('filling cvv.....');
//         //     await page.evaluate(() => {
//         //         document.getElementById('cvd2').value = '735';
//         //         // document.querySelector('#cardCvv', '735');
//         //     });
//         //     // await page.type('#cvd2', '735');
//         //     // await page.type('#cardCvv', '735');

//         //     console.log('solving captcha|=|_|=|');
//         //     await sharp('payment.png').extract({ top: 475, left: 276, width: 73, height: 22 }).greyscale().toFile('paymentCaptcha.png');
//         //     let paymentCpatchaOCRData = await Tesseract.recognize('paymentCaptcha.png', 'eng');
//         //     let paymentCaptchaCode = paymentCpatchaOCRData.data.text;
//         //     console.log(paymentCaptchaCode);

//         //     await page.type('#passline', paymentCaptchaCode);
//         //     console.log('clicking proceed.....');
//         //     await page.click('#proceed_button', { clickCount: 1 });

//         //     console.log('navigating to pin number page.....');
//         //     await page.waitForNavigation();

//         //     console.log('below navigation!!');

//         //     console.log('under error label null!');
//         //     if (await page.$('#cardCaptchaMsg') == null || errorLabel.innerText == 'Please enter valid card number') {
//         //         if (errorLabel.innerText == 'Please enter valid card number') {
//         //             breakReason = 'Card number invalid';
//         //         }
//         //         errorLabel = null;
//         //         break;
//         //     } else {
//         //         console.log('invalid captcha retrying.....');
//         //     }
//         // }


//         // {


//         // if (!errorLabel || errorLabel.innerText == 'Please enter valid card number') {

//         // }
//         // }
//         // let name = "Gajendra sharma";

//         // await page.screenshot({ path: 'payment.png' });
//         // console.log('filling card number.....');
//         // await page.type('#cardNumber', '8172450243368877');
//         // console.log('selecting expiry month.....');
//         // await page.select('#expMnthSelect', '8');
//         // console.log('selecting expiery year.....');
//         // await page.select('#expYearSelect', '2022');
//         // console.log('filling card holder name.....');
//         // await page.type('#cardholderName', name.toString());
//         // console.log('filling cvv.....');
//         // await page.evaluate(() => {
//         //     document.getElementById('cvd2').value = '735';
//         //     // document.querySelector('#cardCvv', '735');
//         // });
//         // // await page.type('#cvd2', '735');
//         // // await page.type('#cardCvv', '735');

//         // console.log('solving captcha|=|_|=|');
//         // await sharp('payment.png').extract({ top: 475, left: 276, width: 73, height: 22 }).greyscale().toFile('paymentCaptcha.png');
//         // let paymentCpatchaOCRData = await Tesseract.recognize('paymentCaptcha.png', 'eng');
//         // let paymentCaptchaCode = paymentCpatchaOCRData.data.text;
//         // paymentCaptchaCode.replace(' ', '');
//         // paymentCaptchaCode.toUpperCase();
//         // console.log(paymentCaptchaCode);

//         // await page.type('#passline', paymentCaptchaCode);
//         // console.log('clicking proceed.....');
//         // await page.click('#proceed_button', { clickCount: 1 });


//         // await page.waitFor(2000);

//         await page.waitForNavigation();

//         let ipinelement = await page.$('#txtipin');

//         if (breakReason) {
//             let responseJson = {
//                 'name': element.B.toString(),
//                 'mobile': element.C.toString(),
//                 'amount': element.D.toString(),
//                 'email': element.F.toString(),
//                 'card_number': element.G.toString(),
//                 'cvv': element.J.toString(),
//                 'status': 'card number invalid',
//                 'ref_number': ''
//             };

//             responseArray.push(responseJson);
//         } else if (ipinelement) {
//             console.log('filling ipin.....')
//             // await page.evaluate((element) => {
//             //     document.getElementById('txtipin').value = element.K.toString();
//             // }, element);
//             await page.type('#txtipin', element.K.toString());
//             console.log('clicking on proceed.....');
//             await page.click('#btnverify', { clickCount: 1 });

//             console.log('paying.....');
//             await page.waitForNavigation();

//             console.log('on success page.....');

//             let status = '';

//             let failureDiv = await page.$('#collect > div.panel-collapse.alert.alert-danger');

//             let successDiv = await page.$('#printdetailsformtop > div');

//             let refNumber = '';

//             if (failureDiv) {
//                 status = 'Pending';
//                 let refNumberElement = await page.$('#collect > div.panel-collapse.alert.alert-danger > div > div:nth-child(4) > span > strong');
//                 refNumber = await page.evaluate(refNumberElement => refNumberElement.textContent, refNumberElement);
//             } else if (successDiv) {
//                 status = 'Success';
//                 let refNumberElement = await page.$('#printdetailsformtop > div > div > div:nth-child(3) > span > strong');
//                 refNumber = await page.evaluate(refNumberElement => refNumberElement.textContent, refNumberElement);
//             }

//             // let refNumberElement = await page.$('#collect > div.panel-collapse.alert.alert-danger > div > div:nth-child(4) > span > strong');
//             // let refNumber = await page.evaluate(refNumberElement => refNumberElement.textContent, refNumberElement);
//             console.log(refNumber);

//             let responseJson = {
//                 'name': element.B.toString(),
//                 'mobile': element.C.toString(),
//                 'amount': element.D.toString(),
//                 'card_number': element.G.toString(),
//                 'cvv': element.J.toString(),
//                 'status': status,
//                 'ref_number': refNumber.toString()
//             };

//             responseArray.push(responseJson);

//             page.close();
//             browser.close();
//             fs.unlinkSync('captcha.png');
//             fs.unlinkSync('page.png');
//             fs.unlinkSync('payment.png');
//             fs.unlinkSync('paymentCaptcha.png');
//         }
//     }

//     let xls = json2xls(responseArray);

//     fs.writeFileSync('result.xlsx', xls, 'binary');

//     console.log('...........script finished...........')

// })();

async function setErrorLabel(page) {
    await page.evaluate(() => {
        let erLbl = document.querySelector('#cardCaptchaMsg');

        if (!erLbl) {
            errorLabel = undefined;
        } else {
            errorLabel = erLbl;
        }
    });
}

async function xyz(page, browser, element) {

    setErrorLabel(page);

    let paymentCaptcha = ' ';

    // fs.unlinkSync('captchaImgaeSSGray.png');

    let payName = `pay-${Date.now()}.png`;
    let captName = `cap-${Date.now()}.png`;
    let captchaImgTag = await page.$('#captcha_image');
    let captchaSrc = await page.evaluate((sel) => {
        return document.querySelector(sel).getAttribute('src');
    }, '#captcha_image');


    await new Promise(r => setTimeout(r, 2000));


    const captchaPage = await browser.newPage();




    let captchaImgHttpUrl = `https://sbipg.sbi${captchaSrc}`;


    await captchaPage.goto(captchaImgHttpUrl);

    await new Promise(r => setTimeout(r, 2000));

    await captchaPage.screenshot({ path: 'captchaPageSS.png' });

    await new Promise(r => setTimeout(r, 2000));

    await page.bringToFront();


    console.log('captcha src here ', captchaSrc);
    await page.screenshot({ path: 'payment.png' });
    await sharp('payment.png').extract({ top: 442, left: 269, width: 84, height: 79 }).greyscale().toFile('paymentCaptcha.png');

    let expDateArr = element.I.toString().split('/');
    let expDateMnth;
    let expDateYear = expDateArr[1];
    switch (expDateArr[0]) {
        case '01':
            expDateMnth = '1';
            break;
        case '02':
            expDateMnth = '2';
            break;
        case '03':
            expDateMnth = '3';
            break;
        case '04':
            expDateMnth = '4';
            break;
        case '05':
            expDateMnth = '5';
            break;
        case '06':
            expDateMnth = '6';
            break;
        case '07':
            expDateMnth = '7';
            break;
        case '08':
            expDateMnth = '8';
            break;
        case '09':
            expDateMnth = '9';
            break;
        case '10':
            expDateMnth = '10';
            break;
        case '11':
            expDateMnth = '11';
            break;
        case '12':
            expDateMnth = '12';
            break;
    }

    let name = element.B.toString();
    console.log('filling card number.....');
    await page.type('#cardNumber', element.G.toString());
    // await page.evaluate((element) => {
    //     document.querySelector('#cardNumber').value = element.G.toString();
    // }, element);
    console.log('selecting expiry month.....');
    await page.select('#expMnthSelect', expDateMnth.toString());
    console.log('selecting expiery year.....');
    await page.select('#expYearSelect', expDateYear.toString());
    console.log('filling card holder name.....');
    // await page.type('#cardholderName', name.toString());
    await page.evaluate((name) => {
        document.querySelector('#cardholderName').value = name.toString();
    }, name);
    console.log('filling cvv.....');
    await page.evaluate((element) => {
        let cvd = document.querySelector('#cvd2');
        let cvv = document.querySelector('#cardCvv');

        if (cvd) {
            cvd.value = element.J.toString();
        }

        if (cvv) {
            cvv.value = element.J.toString();
        }
    }, element);
    // let cvd2 = await page.$('#cvd2');
    // let cvv = await page.$('#cardCvv')
    // await page.type('#cvd2', element.J.toString());
    // await page.type('#cardCvv', element.J.toString());



    // await captchaPage.close();

    // await page.goto(captchaImgHttpUrl);

    console.log('solving captcha|=|_|=|');
    await sharp('captchaPageSS.png').greyscale().toFile('captchaImgaeSSGray.png')
    let paymentCpatchaOCRData = await Tesseract.recognize('paymentCaptcha.png', 'eng');
    console.log(paymentCpatchaOCRData);
    paymentCaptcha = paymentCpatchaOCRData.data.text;
    console.log(paymentCaptcha);
    let spCatReplace = paymentCaptcha.replace(/[^\w\s]/gi, '');
    let rmSpaceCaptcha = spCatReplace.replace(/\s/g, '');
    let newCaptcha = rmSpaceCaptcha.toUpperCase();
    console.log(newCaptcha);

    fs.unlinkSync('captchaPageSS.png');

    await page.type('#passline', newCaptcha);
    // await page.evaluate((paymentCaptcha) => {
    //     document.querySelector('#passline').value = paymentCaptcha;
    // }, paymentCaptcha);
    console.log('clicking proceed.....');
    // await page.waitForSelector('#proceed_button', { visible: true }).then(() => {
    //     console.log('element is there');
    // });
    // let selector = '#proceed_button';
    let proceedBTN = await page.$('#proceed_button');
    // await page.$eval('#proceed_button', elem => elem.click());
    // await page.click('#proceed_button', { clickCount: 1 });
    // await page.waitForNavigation();

    await page.waitForTimeout(1500);

    await proceedBTN.click();

    // await page.waitForNavigation();

    let captchaLabel = await page.$('#cardCaptchaMsg');
    let captchaLblMsg = await page.evaluate(captchaLabel => captchaLabel.textContent, captchaLabel);

    if (captchaLabel && captchaLblMsg == 'Invalid captcha') {
        xyz(page, browser, element);
    } else {
        return;
    }



    // let checkerLbl = await page.$('#cardCaptchaMsg');
    // let txtContnt = await page.evaluate(checkerLbl => checkerLbl.textContent, checkerLbl);
    // console.log(txtContnt);

    // if (!errorLabel || await page.evaluate(checkerLbl => checkerLbl.textContent, checkerLbl) == 'Please enter valid card number') {
    //     if (errorLabel.innerText == 'Please enter valid card number') {
    //         breakReason = 'Card number invalid';
    //     }
    //     errorLabel = null;
    // } else {
    //     console.log(errorLabel);
    //     xyz(page, browser, element);
    // }

    // // if (errorLabel) {

    // // }

}

async function solveFirstCpatcha(page) {
    console.log('solving captcha|=|_|=|');
    await page.screenshot({ path: 'page.png' });

    await sharp('page.png', { greyscale: true }).extract({ top: 462, left: 432, width: 95, height: 31 }).toFile('captcha.png');

    let captchaOCRParseData = await Tesseract.recognize('captcha.png', 'eng');
    let captchaCode = captchaOCRParseData.data.text;

    console.log('captcha solved.....');
    await page.type('#captchaValue', captchaCode);

    console.log('clicking submit button.....');
    await page.click('#frmFeeParams > div.home_btn > button:nth-child(1)', { clickCount: 1 });

    page.on('dialog', async dialog => {
        await dialog.accept();

        await new Promise(r => setTimeout(r, 2000));

        await solveFirstCpatcha(page);
    });
}

function formatDate(date) {
    var dob = new Date(date);
    var dd = String(dob.getDate()).padStart(2, '0');
    var mm = String(dob.getMonth() + 1).padStart(2, '0');
    var yyyy = dob.getFullYear();

    dob = mm + '/' + dd + '/' + yyyy;

    return dob.toString();
}