const express = require('express')
const router = express.Router()
const temps = require('../helpers/templ')
const mailClient = require('../helpers/mailClient')
const jwt = require('jsonwebtoken')
const randomstring = require('randomstring')
const mongroller = require('../controllers/mongoController')
const shooter = require('../controllers/shooter')

const secret = process.env.JWT_SECRET // JWT Secret, will be used once i implement it

// Setting up the list of mails
// This is not supposed to be persistent for longer than 5 minutes, so keeping it ram is okay
// It's a hacky solution to a rpbolem lolo lol ol ol o lo
var sentMails = new Array()
var sentMailTimestamps = new Array()

// Keeping track of the jwts
var authedJWT = new Array()
var authedJWTsalts = new Array()

// Little helper functionform
function is2gimnazija(email) {
  const mailHost = email.substring(email.length - 18)
  return mailHost.toLowerCase() === '@2gimnazija.edu.ba'
}

function qualifications(body) {
  if (
    body.subject.length < 5 &&
    body.body.length < 5 &&
    isEmpty(body.urgency) &&
    isEmpty(body.type)
  )
    return false
  return true
}

//
// Send secret
let sendSecret = process.env.SEND_SECRET

// The Simple routes
//
function isConfirmed(req) {
  return req.session.verified === undefined ? false : req.session.verified.state
}

function isConfirmedMiddleware(req, res, next) {
  const confirmed = req.session.verified === undefined ? false : req.session.verified.state
  if (!confirmed) next({ message: 'Vas token nije validan', status: '403' })
  else next()
}

router.get('/', (req, res, next) => {
  // I will override the inputValue part of temps if the user already has a session
  let inputValue = temps.inputValue
  if (isConfirmed(req)) {
    inputValue = temps.emailInput(req.session.verified.email)
  } // else inputValue = temps.inputValue

  res.render('index', { temps, inputValue })
})

router.get('/form', isConfirmedMiddleware, (req, res, next) => {
  res.render('form', { temps })
})

// reminder lock up the form get method
router.post('/form', (req, res, next) => {
  if (!qualifications(req.body) || !isConfirmed(req)) {
    next({ head: 'Bad Request', status: '500' })
    return
  }
  let shot = shooter.sendMessage(req, res, next, sendSecret, req.session.verified.email)
  if (shot) req.session.destroy((err, event) => {
    if (err) {
      console.error(`Couldn't destroy session: ${err}`)
    }
  })
})

// Auth endpoint
router.post('/auth', (req, res, next) => {
  if (isConfirmed(req) && req.session.verified.email === req.body.email) {
    res.redirect('form') // if they are redirect to /form
    return
  }

  //  Getting the email
  let email = req.body.email

  if (email === process.env.BANNED) res.redirect('https://youtu.be/dQw4w9WgXcQ')

  if (!is2gimnazija(email)) {
    next({
      head: 'Not a school email',
      message: 'Please enter an email that belongs to Druga Gimanzija Sarajevo',
      status: 403
    })
    return
  }

  let lastAttemptTime = Date.now() - req.session.lastAttempt
  if (lastAttemptTime < 60000) {
    let nextTime = 60 - Math.round(lastAttemptTime / 1000)
    next({
      head: 'Please wait',
      message: `Please wait another ${nextTime} seconds to send another email`,
      status: `${nextTime}s`
    })
    return
  }

  req.session.lastAttempt = Date.now()

  // Generating the special salt
  let salt = randomstring.generate(7)

  // Send the confirmation mail
  var mailed = mailClient.sendConfirmation(
    email,
    sentMails,
    sentMailTimestamps,
    salt
  )

  let mail1 = sentMails.push(email)
  let mail2 = sentMailTimestamps.push(Date.now())
  if (mail1 !== mail2)
    console.error(
      '%c BIG ASS FUCKING ERROR WITH THE MAIL LIST',
      'color:red; background-color: black;'
    ) // safety mechanism

  let token1 = authedJWT.push(mailed)
  let token2 = authedJWTsalts.push(salt)
  if (token1 !== token2)
    console.error(
      '%c BIG ASS FUCKING ERROR WITH THE TOKEN LIST',
      'color:red; background-color: black;'
    ) // safety mechanism

  let display = {
    headText: 'The email has been sent',
    underText: 'Success',
    error: false,
    gmail: true,
    detail: 'Please check your school email to find the confirmation link'
  }
  res.render('display', { temps, display })
  return
})

router.get('/auth/:token', (req, res, next) => {
  const token = req.params.token
  let tokenIndex = authedJWT.indexOf(token)
  let salt = authedJWTsalts[tokenIndex]

  if (tokenIndex === -1) {
    next({
      head: 'Invalid Registration Link',
      message: 'Your registration link is invalid',
      status: '403'
    })
    return
  } else {
    authedJWT.splice(tokenIndex)
    authedJWTsalts.splice(tokenIndex)
  }

  let saltySecret = secret + salt
  jwt.verify(token, saltySecret, (err, data) => {
    if (err) console.error(`JWT Error ${err}`)
    else {
      if (data.exp < Date.now())
        next({
          head: 'Expired email',
          message: 'Your email has expired, please re-verify it',
          status: 403
        })
      let bindedEmail = data.email
      mongroller.exists(bindedEmail).then(exist => {

        if (!exist) {
          mongroller.addUser(bindedEmail)
        }
      })

      req.session.verified = {
        state: true,
        email: bindedEmail
      }
      res.redirect('/form')
      return
    }
  })
}) // method for the confimration

const doesExist = async email => {
  let returnvalue
  await mongroller.exists(email).then(data => {
    returnvalue = data
  })
  return returnvalue
}

module.exports = router
