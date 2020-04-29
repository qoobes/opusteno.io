const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
  author: String, // Optional
  body: String,
  date_created: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Message', MessageSchema)
