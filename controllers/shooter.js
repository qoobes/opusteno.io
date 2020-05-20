// Ned to destructure what i got from the form req
// Send mail using a method
// Add a record in the database using the mail function
const temps = require('../helpers/templ')
const mailer = require('../helpers/mailClient')
const mongobase = require('../controllers/mongoController')
const reporter = require('../helpers/report')
require('dotenv').config()

var responsible = 'qoobeethegreat@gmail.com'
var type = ['blank', 'prijava', 'molba']
var urgency = ['normal', 'high']

exports.sendMessage = async (req, res, next, secret, email) => {
  if (secret != process.env.SEND_SECRET) throw('BAD KEY')

  let body = req.body // easier access
  // Constructing the body for the email
  // let constructed = {
  //   author: body.author,
  //   type: type[body.type],
  //   urgency: urgency[body.urgency],
  //   subject: body.subject,
  //   body: body.body
  // }
  let constructed = reporter(body.subject, type[body.type], urgency[body.urgency], body.body, body.author)
  console.log(constructed)

  // type urgency subject body anonimno

  // Constructing for email
  let mailOptions = {
    from: process.env.MAIL_ADDR,
    to: responsible,
    subject: body.subject,
    html: constructed
  }

  // TODO: REMEMBER THAT HAVE THE ABILTY TO SIDPLAY SHIT WITH THIS ASYNCHRONOUSLY YEEY
  // Send mail

  let val1 = await sendmail(mailOptions)
    .then(data => {
       return true
    }).catch(err => {
      console.log(err)
      return false
    })


  // Now it's time to update the database on what's happening
  let val2 = await mongobase.createMessage(constructed, email)
  .then(data => {
    return true
  }).catch(err => {
      console.log(err)
      return false
  })

  if (!val1 && !val2) next({ messsage: 'Try resending your message, sorry for the distrubance' })

  next({ head: 'Success', message: 'Our best carrier pigeons have delivered your message, have a good day!', error: false, status: 200 })
}

const sendmail = async mailOptions => {
  let returnvalue
  await mailer.send(mailOptions).then(data => {
    returnvalue = data
  })
  return returnvalue
}

const createMessage = async message => {
  let returnvalue
  await mongobase.createMessage(message).then(data => {
    returnvalue = data
  })
  return returnvalue
}
