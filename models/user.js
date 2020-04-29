const mongoose = require('mongoose')
const ObjectId = require('mongoose').ObjectId
const Schema = mongoose.Schema


const UserSchema = new Schema({
  email: {
    type: String,
    required: 'Please enter an email'
  },
  messages: [{ message_id: ObjectId }]
})

module.exports = mongoose.model('User', UserSchema)
