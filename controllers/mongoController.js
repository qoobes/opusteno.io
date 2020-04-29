const mongoose = require('mongoose')
const UserModel = require('../models/user')
const User = mongoose.model('User')

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
