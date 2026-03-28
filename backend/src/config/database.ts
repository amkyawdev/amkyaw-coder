import mongoose from 'mongoose'
import { config } from '../config'

export const connectDB = async () => {
  try {
    const mongoUri = config.mongo.uri
    
    console.log('Connecting to MongoDB...')
    await mongoose.connect(mongoUri)
    
    console.log('MongoDB connected successfully')
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected')
    })
    
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error)
    process.exit(1)
  }
}