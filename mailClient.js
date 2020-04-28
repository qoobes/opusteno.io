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
// implement emails not being sent twice in a row
// Make authentication work


const sendConfirmation = (email, sentMails, sentMailTimestamps) => {
  if (!is2gimnazija(email)) return { code: 1005, message: 'Not a 2gimnazija email' }

  let mailIndex = sentMails.indexOf(email) // Get where the mail is; returns -1 if not found

  if (mailIndex !== -1) {
    let age = Date.now() - sentMailTimestamps[mailIndex] // Get the sentmail's age
    // If it's younger than 5 minutes, tell user to wait
    if (age < 60000) return {code: 1010, message: `Please wait another ${60 - (Math.round(lastAttemptTime / 1000))} seconds`}
    // Remove the email and timestamp from the lit
    sentMails.splice(mailIndex)
    sentMailTimestamps.splice(mailIndex)
  }

  // Just where we sending to bois
  let mailOptions = {
    from,
    // to: email,
    to: 'qoobeethegreat@gmail.com',
    subject: 'Please confirm your email for opusteno.io',
    text:
      '<a href="https://link.com">This is a lilnk to the confirmation thing</a>'
  }

  // sending da mail
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      // if shit fucks up send the appropriate errors
      console.log(`An error has occured: \n ${err}`)
      let error = {
        message: err,
        code: 1004
      }
      return error 
    } else {
      // And if shit doesn't fuck up enjoy rainbows
      // Also console log the information
      //
      // TODO: ADAPT MAIL SENDING THIS INTO ANOTHER FUNCTION
      return null
    }
  })
}

module.exports = sendConfirmation
