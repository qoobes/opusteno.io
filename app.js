require('dotenv').config()
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const expressSession = require('express-session')
const mongoose = require('mongoose')
const error = require('./helpers/error')

const indexRouter = require('./routes/index')

const app = express()

// Mongoose setup
const uri = process.env.MONGOOSE_URI
mongoose.Promise = global.Promise
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

// env vars
const cookieSecret = process.env.COOKIE_SECRET

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
// SETTING THE APP ENVIRONMENT
app.set('env', 'production')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  expressSession({
    secret: cookieSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7200000
    }
  })
)
app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  let displayError = require('./helpers/error')
  // set locals, only providing error in development
  if (req.app.get('env') === 'production') {
    let error = {
      head: err.head,
      mseg: err.message,
      error: false,
      code: err.status || 500
    }
    displayError(error, res)
    return
  } else {
    res.locals.message = err.message

    res.locals.error = err

    // render the error page
    res.status(err.status || 500)
    res.render('error')
  }
})
app.listen(3000)

module.exports = app
