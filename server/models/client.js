const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: "Email address is required.",
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
}, {
  timestamps: true
})

module.exports = mongoose.model("Client", clientSchema)