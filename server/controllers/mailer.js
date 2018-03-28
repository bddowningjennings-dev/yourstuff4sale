const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: process.env.MAILER_EMAIL,
         pass: process.env.MAILER_PASSWORD
     }
 });

module.exports = (sendTo, body) => {
  let mailOptions = {
    to: sendTo,
    subject: 'from server',
    html: body.html,
    attachments: body.attachments
  }
  transporter.sendMail(mailOptions, (err, info) => {
    return err ? console.log(err) : console.log(info)
  })
}