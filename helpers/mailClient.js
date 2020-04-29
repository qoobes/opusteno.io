const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const confirmatonTemplate = require('../helpers/confirmation')

require('dotenv').config()

let from = 'qoobestestmail@gmail.com'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ADDR,
    pass: process.env.MAIL_PASS
  }
})

const sauce = process.env.SAUCE
const uri = 'localhost:3000'

// Little helper function
function is2gimnazija(email) {
  const mailHost = email.substring(email.length - 18)
  return mailHost.toLowerCase() === '@2gimnazija.edu.ba'
}

const secret = process.env.JWT_SECRET // JWT Secret, will be used once i implement it

// TODO:
// implement emails not being sent twice in a row
// Make authentication work

const sendConfirmation = (email, sentMails, sentMailTimestamps, salt) => {
  if (!is2gimnazija(email))
    return { code: 1005, message: 'Not a 2gimnazija email' }

  let mailIndex = sentMails.indexOf(email) // Get where the mail is; returns -1 if not found

  if (mailIndex !== -1) {
    let age = Date.now() - sentMailTimestamps[mailIndex] // Get the sentmail's age
    // If it's younger than 5 minutes, tell user to wait
    if (age < 60000)
      return {
        code: 1010,
        message: `Please wait another ${60 -
          Math.round(lastAttemptTime / 1000)} seconds`
      }
    // Remove the email and timestamp from the lit
    sentMails.splice(mailIndex)
    sentMailTimestamps.splice(mailIndex)
  }

  // Getting the data im gonna be sending, ie a thing with a JWT token inside of it
  let payload = {
    email,
    exp: Date.now() + 7200000
  }
  let saltySecret = secret + salt
  console.log(`Salt number 1: ${saltySecret}`)
  const token = jwt.sign(payload, saltySecret)

  // The content
  // Just where we sending to bois
  let mailOptions = {
    from,
    // to: email,
    to: 'qoobeethegreat@gmail.com',
    subject: 'Email #2 confirmation for opusteno.io',
    html: confirmatonTemplate(uri, token)
  }
  
  var returnData

  // sending da mail
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      // if shit fucks up send the appropriate errors
      console.log(`An error has occured: \n ${err}`)
      let error = {
        message: err,
        code: 1004
      }
      returnData =  { success: false, error }
    } else {
      // And if shit doesn't fuck up enjoy rainbows
      // Also console log the information
      //
      // TODO: ADAPT MAIL SENDING THIS INTO ANOTHER FUNCTION
      console.log(data)
    }
  })
  returnData = { success: true, token }
  return returnData
}

module.exports = sendConfirmation
