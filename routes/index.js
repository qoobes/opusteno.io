const express = require('express')
const router = express.Router()
const temps = require('../templ')
const mailClient = require('../mailClient')

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

  //  Getting the email
  let email = req.body.email
  console.log(email)
  
  // Send the confirmation mail
  let error = mailClient(email)
  if (error) {
    if (error.message === 1005) res.send(error.message)
    console.log(error.message)
    if (process.env.MODE === 'dev') res.send(error.message)
  } else res.send('success')

})

router.post('/auth/:token', (res, req) => {}) // method for the confimration

module.exports = router;
