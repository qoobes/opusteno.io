const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    required: 'Please enter an email'
  },
  messages: [{ id: ObjectId }]
})

module.exports = mongoose.model('User', UserSchema)
