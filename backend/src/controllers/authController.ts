import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from '../models/User'
import { config } from '../config'

export class AuthController {
  /**
   * Register new user
   */
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }

      // Check if user exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
      })

      await user.save()

      // Generate JWT
      const payload = { userId: String(user._id), email: user.email }
      const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' } as any)

      res.status(201).json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      })
    } catch (error) {
      console.error('Register error:', error)
      res.status(500).json({ error: 'Failed to register user' })
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' })
      }

      // Find user
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password)
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' })
      }

      // Generate JWT
      const payload = { userId: String(user._id), email: user.email }
      const token = jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' } as any)

      res.json({
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        token,
      })
    } catch (error) {
      console.error('Login error:', error)
      res.status(500).json({ error: 'Failed to login' })
    }
  }

  /**
   * Get current user
   */
  static async me(req: Request, res: Response) {
    try {
      const userId = (req as any).userId
      const user = await User.findById(userId).select('-password')

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json({
        id: user._id,
        email: user.email,
        name: user.name,
      })
    } catch (error) {
      console.error('Me error:', error)
      res.status(500).json({ error: 'Failed to get user' })
    }
  }

  /**
   * Update profile
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId
      const { name, githubToken, openHandsApiKey } = req.body

      const updateData: any = {}
      if (name) updateData.name = name
      if (githubToken) updateData.githubToken = githubToken
      if (openHandsApiKey) updateData.openHandsApiKey = openHandsApiKey

      const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password')

      res.json({
        id: user?._id,
        email: user?.email,
        name: user?.name,
      })
    } catch (error) {
      console.error('Update profile error:', error)
      res.status(500).json({ error: 'Failed to update profile' })
    }
  }
}