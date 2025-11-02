import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createAsset,
  getAssets,
  getAssetById,
  updateAsset,
  deleteAsset
} from '../controllers/assets';

const router = Router();

/**
 * @route   POST /api/assets
 * @desc    Create an asset
 * @access  Private
 */
router.post('/', authenticate, createAsset);

/**
 * @route   GET /api/assets
 * @desc    Get all user assets
 * @access  Private
 */
router.get('/', authenticate, getAssets);

/**
 * @route   GET /api/assets/:id
 * @desc    Get asset by ID
 * @access  Private
 */
router.get('/:id', authenticate, getAssetById);

/**
 * @route   PUT /api/assets/:id
 * @desc    Update asset
 * @access  Private
 */
router.put('/:id', authenticate, updateAsset);

/**
 * @route   DELETE /api/assets/:id
 * @desc    Delete asset
 * @access  Private
 */
router.delete('/:id', authenticate, deleteAsset);

export default router;

