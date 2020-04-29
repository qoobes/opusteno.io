const mongoose = require('mongoose')
const User = mongoose.model(User)

exports.addUser = new Promise(email => {
  const new_user = new User({ email })
  new_user.save((err) => { // Optional event thing
    if (err) {
      consoel.log(err)
      Promise.reject(false)
    } else {
      console.log(`Created a user for ${email}`)
      Promise.resolve(true)
    }
  })
})
