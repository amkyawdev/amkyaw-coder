import { Router } from 'express'
import { openHandsService } from '../services/openhandsService'

const router = Router()

// Start a new session (conversation with AI)
router.post('/start', async (req, res, next) => {
  try {
    const { message, repository } = req.body
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const repo = repository || 'default-project'
    const result = await openHandsService.startConversation(message, repo)
    
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// Start session with streaming
router.post('/stream-start', async (req, res, next) => {
  try {
    const { message, repository } = req.body
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const repo = repository || 'default-project'
    const result = await openHandsService.startConversationStream(message, repo)
    
    res.json(result)
  } catch (error) {
    next(error)
  }
})

// Get session status
router.get('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params
    const status = await openHandsService.getConversationStatus(id)
    
    res.json(status)
  } catch (error) {
    next(error)
  }
})

// Poll session until completion
router.post('/:id/poll', async (req, res, next) => {
  try {
    const { id } = req.params
    const result = await openHandsService.pollUntilComplete(id)
    
    res.json(result)
  } catch (error) {
    next(error)
  }
})

export default router