const express = require('express')
const router = express.Router()
const temps = require('../templ')
const mailClient = require('../mailClient')
const jwt = require('jsonwebtoken')
const randomstring = require('randomstring')
const secret = process.env.JWT_SECRET // JWT Secret, will be used once i implement it

// Setting up the list of mails 
// This is not supposed to be persistent for longer than 5 minutes, so keeping it ram is okay
// It's a hacky solution to a rpbolem lolo lol ol ol o lo
var sentMails = new Array()
var sentMailTimestamps = new Array()

// Keeping track of the jwts
var authedJWT = new Array()
var authedJWTsalts = new Array()

// The Simple routes

function isConfirmed (req, res, next) {
    const confirmed = req.session.verified === undefined ? false : req.session.verified.state
    if (!confirmed) next({ message: 'Vas token nije validan', status: '403'  })
    else next()
}

router.get('/', (req, res, next) => {
  // I will override the inputValue part of temps if the user already has a session
  res.render('index', { temps })
})

router.get('/about', (req, res, next) => {
  res.render('about', { temps })
})

router.get('/form', isConfirmed, (req, res, next) => {
  res.render('form', { temps })
})

// Auth endpoint
router.post('/auth', (req, res, next) => {
  const confirmed = req.session.verified === undefined ? false : req.session.verified.state // check if  user is confirmed
  if (confirmed) res.redirect('form') // if they are redirect to /form
  let lastAttemptTime = Date.now() - req.session.lastAttempt
  if (lastAttemptTime < 60000) res.send(`Please wait another ${60 - (Math.round(lastAttemptTime / 1000))} seconds`)

  req.session.lastAttempt = Date.now()

  //  Getting the email
  let email = req.body.email
  
  // Generating the special salt 
  let salt = randomstring.generate(7) 
  
  // Send the confirmation mail
  var mailed = mailClient(email, sentMails, sentMailTimestamps, salt)
  console.log(mailed)

  if (!mailed.success) {
    if (mailed.error.message === 1005) res.send(mailed.error.message)
    if (process.env.MODE === 'dev') res.send(mailed.error.message)
  } else {
    let mail1 = sentMails.push(email)
    let mail2 = sentMailTimestamps.push(Date.now())
    if (mail1 !== mail2) console.log('BIG ASS FUCKING ERROR WITH THE MAIL LIST') // safety mechanism

    let token1 = authedJWT.push(mailed.token)
    let token2 = authedJWTsalts.push(salt)
    if (token1 !== token2) console.log('BIG ASS FUCKING ERROR WITH THE TOKEN LIST') // safety mechanism 

    res.send('success')
  }

})

router.get('/auth/:token', (req, res) => {
  const token = req.params.token
  let tokenIndex = authedJWT.indexOf(token)

  if (tokenIndex === -1) res.send('Token no existed')

  let salt = authedJWTsalts[tokenIndex]
  let saltySecret = secret+salt

  jwt.verify(token, saltySecret, (err, data) => {
    if (err) res.send(err)
    else {
      if (data.exp < Date.now()) res.send('Expired email')
      let bindedEmail = data.email

      req.session.verified = {
        state: true,
        email: bindedEmail
      }
      res.redirect('/form')
    }
  })   


}) // method for the confimration

module.exports = router;
