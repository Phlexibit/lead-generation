const mongoose = require('mongoose')

const connectDB = (url) => {

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully')
  })

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err)
  })

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected')
  })

  return mongoose.connect(url)
}

module.exports = connectDB
