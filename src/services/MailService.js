'use strict';

const nodemailer = require('nodemailer');

module.exports = {
    sendEmail: send,
    sendVerificationEmail: sendVerificationEmail
}

var fromEmail = 'no-eply@sociaid.com';

const smtpSender = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'victor@sociaid.com',
        pass: 'victorarabe'
    }
});

function send(recipient, subject, message) {

    const mail = {
        from: fromEmail,
        to: recipient,
        subject: subject,
        html: message
    }


    smtpSender.sendMail(mail, callback);

    console.log('Email sent to: ' + mail.to);
}

function sendVerificationEmail(host, verificationID, recipientEmail, callback) {

    const htmlMessage = '<a href=' + host + '/verify?verificationId=' + verificationID + '>Clique Aqui</a>';

    send(recipientEmail, 'Sociaid Confirme email', htmlMessage, callback);

}