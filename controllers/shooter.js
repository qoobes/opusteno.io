// Ned to destructure what i got from the form req
// Send mail using a method
// Add a record in the database using the mail function
const temps = require('../helpers/templ')
const mailer = require('../helpers/mailClient')
const mongobase = require('../controllers/mongoController')
require('dotenv').config()

var responsible = 'qoobeethegreat@gmail.com'
var type = ['blank', 'prijava', 'molba']
var urgency = ['normal', 'high']

exports.sendMessage = (req, res, secret) => {
  if (secret != process.env.SEND_SECRET) throw('BAD KEY')

  let body = req.body // easier access
  // Constructing the body for the email
  let constructed = {
    author: body.author,
    type: type[body.type],
    urgency: urgency[body.urgency],
    subject: body.subject,
    body: body.body
  }

  // type urgency subject body anonimno

  // Constructing for email
  let html = temps.constructBody(constructed)

  let mailOptions = {
    from: 'qoobestestmail@gmail.com',
    to: responsible,
    subject: body.subject,
    html
  }

  // TODO: REMEMBER THAT HAVE THE ABILTY TO SIDPLAY SHIT WITH THIS ASYNCHRONOUSLY YEEY
  // Send mail
  let output = ""

  sendmail(mailOptions)
    .then(data => {
      // res.send(`Vasa poruka je bila uspjesno poslana na odgovarajuci email account ${data}`)
       output += `Vasa poruka je bila uspjesno poslana na odgovarajuci email account ${data} \n`
    })


  // Now it's time to update the database on what's happening
  mongobase.createMessage(constructed).then(data => {
    output += `Vasa poruka je bila uspjesno sinhronizirana sa bazom ${data} \n`
    res.send(output)
  })
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
