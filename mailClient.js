const nodemailer = require('nodemailer')
require('dotenv').config()

let from = 'qoobestestmail@gmail.com'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ADDRESS,
    pass: process.env.MAIL_PASS
  }
})

const secret = process.env.CONFIRM_SECRET
const sendConfirmation = email => {
  let mailOptions = {
    from,
    to: email,
    subject: 'Please confirm your email for opusteno.io',
    text: '<a href="https://link.com">This is a lilnk to the confirmation thing</a>'
  }

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(`An error has occured: \n ${err}`)
      return false
    } else return true
  })
}

module.exports = sendConfirmation
