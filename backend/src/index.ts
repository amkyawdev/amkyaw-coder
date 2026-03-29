import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { connectDB } from './config/database'
import { initDB } from './config/initDb'

// Routes
import sessionsRouter from './routes/sessions'
import projectsRouter from './routes/projects'
import filesRouter from './routes/files'
import eventsRouter from './routes/events'
import authRouter from './routes/auth'

// Middleware
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const httpServer = createServer(app)

// WebSocket Server
const wss = new WebSocketServer({ server: httpServer })

wss.on('connection', (ws) => {
  console.log('Client connected')
  
  ws.on('message', (message) => {
    console.log('Received:', message.toString())
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/projects', projectsRouter)
app.use('/api/files', filesRouter)
app.use('/api/events', eventsRouter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 4000

// Connect to MongoDB and start server
const startServer = async () => {
  await connectDB()
    
    // Initialize database tables
    await initDB()
  
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

startServer()

export { app, wss }