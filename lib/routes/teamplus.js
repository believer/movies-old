'use strict';

var nodemailer = require('nodemailer');

exports.redirect = function (req, res) {
  res.writeHead(301,
    { Location: 'http://teamplus46.se' }
  );
  res.end();
};

exports.send = function (req, res) {
  var body = req.body;
  var transport = nodemailer.createTransport('Sendmail');
  var mailOptions = {
    from: 'info@teamplus46.se',
    to: 'info@teamplus46.se',
    subject: 'Hello world!',
    text: body
  };

  transport.sendMail(mailOptions, function (err,response) {
    console.log('err',err);
    console.log('response',response);

    if (response.messageId) {
      res.send('Mail sent');
    }
  });

};