import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getMarketplace,
  addToMarketplace,
  removeFromMarketplace,
  updateMarketplaceSettings,
  getMarketingPreferences
} from '../controllers/marketplace';

const router = Router();

/**
 * @route   GET /api/marketplace
 * @desc    Get user marketplace
 * @access  Private
 */
router.get('/', authenticate, getMarketplace);

/**
 * @route   POST /api/marketplace/add
 * @desc    Add item to marketplace
 * @access  Private
 */
router.post('/add', authenticate, addToMarketplace);

/**
 * @route   DELETE /api/marketplace/:id
 * @desc    Remove item from marketplace
 * @access  Private
 */
router.delete('/:id', authenticate, removeFromMarketplace);

/**
 * @route   PUT /api/marketplace/settings
 * @desc    Update marketplace settings
 * @access  Private
 */
router.put('/settings', authenticate, updateMarketplaceSettings);

/**
 * @route   GET /api/marketplace/preferences
 * @desc    Get marketing preferences
 * @access  Private
 */
router.get('/preferences', authenticate, getMarketingPreferences);

export default router;

