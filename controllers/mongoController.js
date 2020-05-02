const mongoose = require('mongoose')
const UserModel = require('../models/user')
const MessageModel = require('../models/messages')
const User = mongoose.model('User')
const Message = mongoose.model('Message')

exports.exists = email => {
  return new Promise((resolve, reject) => {
  User.exists({ email }, (err, result) => {
    if (err) {
      console.error(err)
      resolve(false)
    } else {
      console.log(`THE USER DOES ${result}`)
      resolve(result)
    }
  })
  })
}

exports.addUser = async email => {
  return new Promise((resolve, reject) => {
    const new_user = new User({ email })
    new_user.save((err, event) => {
      if (err) {
        console.error(err)
        resolve(false)
      } else {
        console.log(`Created a user for ${event.email}`)
        resolve(event)
      }
    })
  })
}

exports.createMessage = async (message, email) => {
  return new Promise((resolve, reject) => {
    let new_message = new Message(message)
    new_message.save((err, event) => {
      if (err) {
        console.error(`An error has occured in exports.createMessag: ${err}`)
        resolve(false)
      } else {
        console.log(`A new message has been added: ${event}`)
        // addMessageToUser(data.id, email)
        resolve(true)
      }
    })
  })
}

// function addMessageToUser(id) {
//   User.findOne()
// }
