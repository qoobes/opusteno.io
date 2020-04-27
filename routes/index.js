const express = require('express')
const router = express.Router()
const temps = require('../templ')

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

module.exports = router;
