import { Router } from 'express'
import pool from '../config/database'

const router = Router()

// Get all projects for user
router.get('/', async (req, res, next) => {
  const client = await pool.connect()
  try {
    const userId = req.headers['x-user-id'] as string
    
    let query = 'SELECT * FROM projects'
    let params: any[] = []
    
    if (userId) {
      query += ' WHERE user_id = $1 ORDER BY updated_at DESC'
      params = [userId]
    } else {
      query += ' ORDER BY updated_at DESC'
    }
    
    const result = await client.query(query, params)
    res.json(result.rows)
  } catch (error) {
    next(error)
  } finally {
    client.release()
  }
})

// Create new project
router.post('/', async (req, res, next) => {
  const client = await pool.connect()
  try {
    const { name, description, githubRepo } = req.body
    const userId = req.headers['x-user-id'] as string
    
    const result = await client.query(
      'INSERT INTO projects (user_id, name, description, github_repo) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId || null, name, description || '', githubRepo || '']
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    next(error)
  } finally {
    client.release()
  }
})

// Get project by ID
router.get('/:id', async (req, res, next) => {
  const client = await pool.connect()
  try {
    const { id } = req.params
    
    const result = await client.query(
      'SELECT * FROM projects WHERE id = $1',
      [id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    next(error)
  } finally {
    client.release()
  }
})

// Update project
router.put('/:id', async (req, res, next) => {
  const client = await pool.connect()
  try {
    const { id } = req.params
    const { name, description, files, githubRepo } = req.body
    
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1
    
    if (name) {
      updates.push(`name = $${paramCount++}`)
      values.push(name)
    }
    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`)
      values.push(description)
    }
    if (githubRepo) {
      updates.push(`github_repo = $${paramCount++}`)
      values.push(githubRepo)
    }
    
    updates.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)
    
    const result = await client.query(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    res.json(result.rows[0])
  } catch (error) {
    next(error)
  } finally {
    client.release()
  }
})

// Delete project
router.delete('/:id', async (req, res, next) => {
  const client = await pool.connect()
  try {
    const { id } = req.params
    
    const result = await client.query(
      'DELETE FROM projects WHERE id = $1 RETURNING id',
      [id]
    )
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    res.json({ message: 'Project deleted' })
  } catch (error) {
    next(error)
  } finally {
    client.release()
  }
})

export default router