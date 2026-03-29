import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import pool from '../config/database'
import { config } from '../config'

export class AuthController {
  /**
   * Register new user
   */
  static async register(req: Request, res: Response) {
    const client = await pool.connect()
    try {
      const { email, password, name } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }

      // Check if user exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [email]
      )
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Email already registered' })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const result = await client.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, hashedPassword, name || email.split('@')[0]]
      )
      const user = result.rows[0]

      // Generate JWT
      const payload = { userId: String(user.id), email: user.email }
      const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' } as any)

      res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      })
    } catch (error) {
      console.error('Register error:', error)
      res.status(500).json({ error: 'Failed to register user' })
    } finally {
      client.release()
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response) {
    const client = await pool.connect()
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }

      // Find user
      const result = await client.query(
        'SELECT id, email, password, name FROM users WHERE email = $1',
        [email]
      )
      const user = result.rows[0]
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Generate JWT
      const payload = { userId: String(user.id), email: user.email }
      const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' } as any)

      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Failed to login' })
    } finally {
      client.release()
    }
  }

  /**
   * Get current user
   */
  static async me(req: Request, res: Response) {
    const client = await pool.connect()
    try {
      const userId = (req as any).userId
      const result = await client.query(
        'SELECT id, email, name FROM users WHERE id = $1',
        [userId]
      )
      const user = result.rows[0]

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
      })
    } catch (error) {
      console.error('Me error:', error)
      res.status(500).json({ error: 'Failed to get user' })
    } finally {
      client.release()
    }
  }

  /**
   * Update profile
   */
  static async updateProfile(req: Request, res: Response) {
    const client = await pool.connect()
    try {
      const userId = (req as any).userId
      const { name, githubToken, openHandsApiKey } = req.body

      const updates: string[] = []
      const values: any[] = []
      let paramCount = 1

      if (name) {
        updates.push(`name = $${paramCount++}`)
        values.push(name)
      }
      if (githubToken) {
        updates.push(`github_token = $${paramCount++}`)
        values.push(githubToken)
      }
      if (openHandsApiKey) {
        updates.push(`openHands_api_key = $${paramCount++}`)
        values.push(openHandsApiKey)
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'Nothing to update' })
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`)
      values.push(userId)

      const result = await client.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, email, name`,
        values
      )
      const user = result.rows[0]

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
      })
    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({ error: 'Failed to update profile' })
    } finally {
      client.release()
    }
  }
}