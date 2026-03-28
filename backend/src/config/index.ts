import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: process.env.PORT || 4000,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // MongoDB
  mongo: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/amkyawcoder',
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: '7d',
  },

  // OpenHands
  openhands: {
    baseUrl: process.env.OPENHANDS_API_URL || 'https://app.all-hands.dev',
    apiKey: process.env.OPENHANDS_API_KEY || '',
  },

  // Redis (optional)
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
}