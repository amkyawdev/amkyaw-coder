import { Router } from 'express'

const router = Router()

// SSE endpoint for real-time updates
router.get('/sse/:sessionId', (req, res) => {
  const { sessionId } = req.params
  
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  
  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', sessionId })}\n\n`)
  
  // Keep connection alive with heartbeat
  const heartbeat = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`)
  }, 30000)
  
  // Clean up on close
  req.on('close', () => {
    clearInterval(heartbeat)
    console.log(`SSE connection closed for session: ${sessionId}`)
  })
})

// WebSocket upgrade endpoint
router.get('/ws', (req, res) => {
  // This is handled by the main WebSocket server
  // Just redirect to ws://host:port
  res.json({ 
    message: 'WebSocket available at the same host/port',
    protocol: 'ws'
  })
})

export default router