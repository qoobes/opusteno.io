const mongoose = require('mongoose')
const UserModel = require('../models/user')
const MessageModel = require('../models/messages')
const User = mongoose.model('User')
const Message = mongoose.model('Message')

exports.exists = email => {
  User.exists({ email }, (err, result) => {
    if (err) {
      console.error(err)
      return false
    } else {
      return result
    }
  })
}

exports.addUser = email => {
  const new_user = new User({ email })
  new_user.save((err, event) => {
    if (err) {
      console.error(err)
      return false
    } else {
      console.log(`Created a user for ${event.email}`)
      return event
    }
  })
}

exports.createMessage = async message => {
  return new Promise((resolve, reject) => {
    let new_message = new Message(message)
    new_message.save((err, event) => {
      if (err) {
        console.error(`An error has occured in exports.createMessag: ${err}`)
        resolve(false)
      } else {
        console.log(`A new message has been added: ${event}`)
        resolve(event)
      }
    })
  })
}
