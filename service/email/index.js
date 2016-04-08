var nodemailer = require('nodemailer');
var _ = require('lodash');
var fs = require('fs');

//邮箱注册获取验证码模板
var gain_validate_code_tpl = _.template(fs.readFileSync(__dirname + '/tpls/gain_validate_code.html'));

var smtpConfig = {
    host: 'smtp.fengimage.com',
    //port: 465,
    //secure: false, // use SSL
    auth: {
        user: 'admin@fengimage.com',
        pass: 'w@wj8381390'
    }
};
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpConfig);

function sendEmail(mailOptions, callback) {
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
        transporter.close();
        if (typeof callback === 'function') {
            callback(error, info);
        }
    });
}

exports.sendCodeMail = function (code, to, callback) {
    var d = new Date();
    var data = {
        ymd: d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日',
        sf: d.getHours() + '点' + d.getMinutes() + '分',
        link: 'www.fengimage.com',
        code: code
    };
    var html = gain_validate_code_tpl(data);
    var mailOptions = {
        from: 'admin@fengimage.com', // sender address
        to: to, // list of receivers
        subject: '风影网-用户获取验证码', // Subject line
        html: html
    };
    sendEmail(mailOptions, callback);
}