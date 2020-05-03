const mongoose = require('mongoose')
const UserModel = require('../models/user')
const MessageModel = require('../models/messages')
const User = mongoose.model('User')
const Message = mongoose.model('Message')

exports.exists = email => {
  return new Promise(resolve => {
    User.exists({ email }, (err, result) => {
      if (err) {
        console.error(err)
        resolve(false)
      } else {
        resolve(result)
      }
    })
  })
}

exports.addUser = async email => {
  return new Promise(resolve => {
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
  return new Promise(resolve => {
    let new_message = new Message(message)
    new_message.save((err, event) => {
      if (err) {
        console.error(`An error has occured in exports.createMessag: ${err}`)
        resolve(false)
      } else {
        console.log(`A new message has been added`)
        if (addMessageToUser(event.id, email)) resolve(true)
        resolve(false)
      }
    })
  })
}

function addMessageToUser(id, email) {
  User.findOne({ email }, (err, user) => {
    if (err) {
      console.error(`An error has occured in exports.addMessageToUser: ${err}`)
      return false
    } else {
      user.messages.push(id)
      console.log(`The id is ${id}`)
      user.save((err, event) => {
        if (err) {
          console.error(`An error has occured in addMessageToUser: ${err}`)
        } else {
          return true
        }
      })
    }
  })
}
