var nodemailer = require('nodemailer');
var _ = require('lodash');
var fs = require('fs');

var htmlTpl = fs.readFileSync('./sign_up_tpl.html');
var d = new Date();
var data = {
    ymd: d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日',
    sf: d.getHours() + '点' + d.getMinutes() + '分',
    link: 'http://www.fengimage.com/'
};

var html = _.template(htmlTpl)(data);
var smtpConfig = {
    //service:'fengimage',
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

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'admin@fengimage.com', // sender address
    to: '1554684195@qq.com', // list of receivers
    subject: '风影网-用户邮箱验证', // Subject line
    html: html // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Message sent: ' + info.response);
    }
    transporter.close();
});