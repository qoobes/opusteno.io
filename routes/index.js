const express = require("express")
const router = express.Router()
const temps = require("../helpers/templ")
const mailClient = require("../helpers/mailClient")
const jwt = require("jsonwebtoken")
const randomstring = require("randomstring")
const mongroller = require("../controllers/mongoController")
const shooter = require("../controllers/shooter")

const secret = process.env.JWT_SECRET // JWT Secret, will be used once i implement it

// Setting up the list of mails
// This is not supposed to be persistent for longer than 5 minutes, so keeping it ram is okay
// It's a hacky solution to a rpbolem lolo lol ol ol o lo
var sentMails = new Array()
var sentMailTimestamps = new Array()

// Keeping track of the jwts
var authedJWT = new Array()
var authedJWTsalts = new Array()

// Little helper function
function is2gimnazija(email) {
  const mailHost = email.substring(email.length - 18)
  return mailHost.toLowerCase() === "@2gimnazija.edu.ba"
}

// Send secret
let sendSecret = process.env.SEND_SECRET

// The Simple routes
//
function isConfirmed(req) {
  return req.session.verified === undefined ? false : req.session.verified.state
}

function isConfirmedMiddleware(req, res, next) {
  const confirmed =
    req.session.verified === undefined ? false : req.session.verified.state
  if (!confirmed) next({ message: "Vas token nije validan", status: "403" })
  else next()
}

router.get("/", (req, res, next) => {
  // I will override the inputValue part of temps if the user already has a session
  let inputValue = temps.inputValue
  if (isConfirmed(req)) {
    inputValue = temps.emailInput(req.session.verified.email)
  } // else inputValue = temps.inputValue

  res.render("index", { temps, inputValue })
})

router.get("/about", (req, res, next) => {
  res.render("about", { temps })
})

// router.get('/form', isConfirmedMiddleware, (req, res, next) => {
//   res.render('form', { temps })
// })
router.get("/form", (req, res, next) => {
  res.render("form", { temps })
})

// reminder lock up the form get method
router.post("/form", (req, res, next) => {
  console.log(`Form speaking: ${shooter.sendMessage(req, res, sendSecret)}`) // Remove later
})

// Auth endpoint
router.post("/auth", (req, res, next) => {
  if (isConfirmed(req) && req.session.verified.email === req.body.email) {
    res.redirect("form") // if they are redirect to /form
  }

  //  Getting the email
  let email = req.body.email

  if (!is2gimnazija(email)) {
    res.send("not a 2gimnazija mail")
    return
  }

  let lastAttemptTime = Date.now() - req.session.lastAttempt
  if (lastAttemptTime < 60000) {
    res.send( `Please wait another ${60 - Math.round(lastAttemptTime / 1000)} seconds`)
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
      "%c BIG ASS FUCKING ERROR WITH THE MAIL LIST",
      "color:red; background-color: black;"
    ) // safety mechanism

  let token1 = authedJWT.push(mailed)
  let token2 = authedJWTsalts.push(salt)
  if (token1 !== token2)
    console.error(
      "%c BIG ASS FUCKING ERROR WITH THE TOKEN LIST",
      "color:red; background-color: black;"
    ) // safety mechanism

  res.send("success")
  return
})

router.get("/auth/:token", (req, res) => {
  const token = req.params.token
  let tokenIndex = authedJWT.indexOf(token)
  let salt = authedJWTsalts[tokenIndex]

  if (tokenIndex === -1) {
    res.send("Token no existed")
    return
  } else {
    authedJWT.splice(tokenIndex)
    authedJWTsalts.splice(tokenIndex)
  }

  let saltySecret = secret + salt
  jwt.verify(token, saltySecret, (err, data) => {
    if (err) res.send(err)
    else {
      if (data.exp < Date.now()) res.send("Expired email")
      let bindedEmail = data.email
      if (!mongroller.exists(bindedEmail)) mongroller.addUser(bindedEmail)

      req.session.verified = {
        state: true,
        email: bindedEmail
      }
      res.redirect("/form")
      return
    }
  })
}) // method for the confimration

module.exports = router
