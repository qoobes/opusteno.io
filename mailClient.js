const nodemailer = require('nodemailer')
require('dotenv').config()

let from = 'qoobestestmail@gmail.com'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ADDR,
    pass: process.env.MAIL_PASS
  }
})

// Little helper function
function is2gimnazija(email) {
  const mailHost = email.substring(email.length - 18)
  return mailHost.toLowerCase() === '@2gimnazija.edu.ba'
}

const secret = process.env.JWT_SECRET // JWT Secret, will be used once i implement it

// TODO:
// Make authentication work
// implement emails not being sent twice in a row

const sendConfirmation = email => {
  if (!is2gimnazija(email)) return { code: 1005, message: 'Not a 2gimnazija email' }
  let mailOptions = {
    from,
    to: email,
    subject: 'Please confirm your email for opusteno.io',
    text: '<a href="https://link.com">This is a lilnk to the confirmation thing</a>'
  }

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(`An error has occured: \n ${err}`)
      let error = {
        message: err,
        code: 1004
      }
      return error
    } else {
      if (process.env.MODE === 'dev') console.log(data)
      return null
    }
  })
}

module.exports = sendConfirmation
