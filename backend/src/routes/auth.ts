import { Router } from 'express'
import { AuthController } from '../controllers/authController'
import { authenticateToken } from '../middleware/authMiddleware'

const router = Router()

// Register new user
router.post('/register', AuthController.register)

// Login user
router.post('/login', AuthController.login)

// Get current user (protected)
router.get('/me', authenticateToken, AuthController.me)

// Update profile (protected)
router.put('/profile', authenticateToken, AuthController.updateProfile)

export default router