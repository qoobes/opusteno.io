const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MessageSchema = new Schema({
  author: String, // Optional - gets filled in only if annonimity is false
  type: {
    type: String,
    enum: ['blank', 'prijava', 'molba'],
    default: 'undefined'
  },
  urgency: {
    type: String,
    enum: ['normal', 'high'],
    default: 'normal'
  },
  subject: {
    type: String,
    required: 'Please enter a subject'
  },
  body: {
    type: String,
    required: 'Please enter a body'
  },
  date_created: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Message', MessageSchema)
