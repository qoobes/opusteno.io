const express = require('express')
const router = express.Router()
const temps = require('../templ')

// The Simple routes

router.get('/', (req, res, next) => {
  // I will override the inputValue part of temps if the user already has a session
  res.render('index', { temps })
})

router.get('/about', (req, res, next) => {
  res.render('about', { temps })
})

module.exports = router;
