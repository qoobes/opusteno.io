const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const confirmatonTemplate = require("../helpers/confirmation")

require("dotenv").config()

let from = process.env.MAIL_ADDR

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ADDR,
    pass: process.env.MAIL_PASS
  }
})

const sauce = process.env.SAUCE
const uri = process.env.BASE_URI

const secret = process.env.JWT_SECRET // JWT Secret, will be used once i implement it

// TODO: implement emails not being sent twice in a row
// Make authentication work

exports.sendConfirmation = (email, sentMails, sentMailTimestamps, salt) => {
  let mailIndex = sentMails.indexOf(email) // Get where the mail is; returns -1 if not found

  if (mailIndex !== -1) {
    let age = Date.now() - sentMailTimestamps[mailIndex] // Get the sentmail's age
    // If it's younger than 5 minutes, tell user to wait
    if (age < 60000)
      return {
        code: 1010,
        message: `Please wait another ${60 - Math.round(age / 1000)} seconds`
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
  const token = jwt.sign(payload, saltySecret)

  // The content
  // Just where we sending to bois
  let mailOptions = {
    from,
    to: email,
    // to: 'qoobeethegreat@gmail.com',
    subject: "Email Confirmation for Box",
    html: confirmatonTemplate(uri, token)
  }

  // Sending beigns
  exports.send(mailOptions).then(console.log(`Conf email sent`))
  return token
}

exports.send = mailOptions => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, data) => {
      if (err) {
        console.log(`An error has occured: \n ${err}`)
        resolve(false)
      } else {
        resolve(true)
      }
    })
  })
}
