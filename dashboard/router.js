const express = require('express')
const router = express.Router()
const dashboard = require('index')

router.set('views', path.join(__dirname, 'views'))

router.get('/', (req, res, next) => {
  if (req.session.teacher) dashboard.enter(req.session.teacherid)
  else dashboard.init()
})

module.exports = router
