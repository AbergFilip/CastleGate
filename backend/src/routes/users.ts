import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getUserProfile, updateUserProfile } from '../controllers/users';

const router = Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', authenticate, getUserProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, updateUserProfile);

export default router;

