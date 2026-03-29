import { Router } from 'express'
import pool from '../config/database'

const router = Router()

// Get all sessions for user
router.get('/', async (req, res, next) => {
  const client = await pool.connect()
  try {
    const userId = req.headers['x-user-id'] as string
    
    let query = 'SELECT * FROM sessions'
    let params: any[] = []
    
    if (userId) {
      query += ' WHERE user_id = $1 ORDER BY created_at DESC'
      params = [userId]
    } else {
      query += ' ORDER BY created_at DESC'
    }
    
    const result = await client.query(query, params)
    res.json(result.rows)
  } catch (error) {
    next(error)
  } finally {
    client.release()
  }
})

// Create new session
router.post('/', async (req, res, next) => {
  const client = await pool.connect()
  try {
    const { projectId, mode } = req.body
    const userId = req.headers['x-user-id'] as string
    
    const result = await client.query(
      'INSERT INTO sessions (project_id, user_id, mode, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [projectId, userId || null, mode || 'chat', 'pending']
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    next(error)
  } finally {
    client.release()
  }
})

// Get session by ID
router.get('/:id', async (req, res, next) => {
  const client = await pool.connect()
  try {
    const { id } = req.params
    
    const result = await client.query(
      'SELECT * FROM sessions WHERE id = $1',
      [id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    next(error)
  } finally {
    client.release()
  }
})

// Update session
router.put('/:id', async (req, res, next) => {
  const client = await pool.connect()
  try {
    const { id } = req.params
    const { status, mode } = req.body
    
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1
    
    if (status) {
      updates.push(`status = $${paramCount++}`)
      values.push(status)
    }
    if (mode) {
      updates.push(`mode = $${paramCount++}`)
      values.push(mode)
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)
    
    const result = await client.query(
      `UPDATE sessions SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    next(error)
  } finally {
    client.release()
  }
})

// Delete session
router.delete('/:id', async (req, res, next) => {
  const client = await pool.connect()
  try {
    const { id } = req.params
    
    const result = await client.query(
      'DELETE FROM sessions WHERE id = $1 RETURNING id',
      [id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Session not found' })
    }
    
    res.json({ message: 'Session deleted' })
  } catch (error) {
    next(error)
  } finally {
    client.release()
  }
})

export default router