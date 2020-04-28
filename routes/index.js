const express = require('express')
const router = express.Router()
const temps = require('../templ')
const mailClient = require('../mailClient')
var nigga = 0

// Setting up the list of mails 
// This is not supposed to be persistent for longer than 5 minutes, so keeping it ram is okay
// It's a hacky solution to a rpbolem lolo lol ol ol o lo
var sentMails = new Array()
var sentMailTimestamps = new Array()

// The Simple routes

function isConfirmed (req, res, next) {
    const confirmed = req.session.verified === undefined ? false : req.session.verified.state
    if (!confirmed) next({ message: 'Vas token nije validan', status: '403'  })
    else next()
}

router.get('/', (req, res, next) => {
  // I will override the inputValue part of temps if the user already has a session
  res.render('index', { temps })
  nigga++
  console.log(nigga)
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
  console.log(email)
  
  // Send the confirmation mail
  let error = mailClient(email, sentMails, sentMailTimestamps)
  console.log(`The one from the router: \n ${sentMails}`)
  if (error) {
    if (error.message === 1005) res.send(error.message)
    console.log(error.message)
    if (process.env.MODE === 'dev') res.send(error.message)
  } else {
    let num1 = sentMails.push(email)
    let num2 = sentMailTimestamps.push(Date.now())
    if (num1 !== num2) console.log('BIG ASS FUCKING ERROR WITH THE MAIL LIST')
    res.send('success')
  }

})

router.post('/auth/:token', (res, req) => {}) // method for the confimration

module.exports = router;
