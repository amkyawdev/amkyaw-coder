import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

// Neon PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Test connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL (Neon)')
})

export const connectDB = async () => {
  try {
    const client = await pool.connect()
    console.log('Connected to PostgreSQL database')
    client.release()
  } catch (error) {
    console.error('Failed to connect to PostgreSQL:', error)
    throw error
  }
}

export default pool