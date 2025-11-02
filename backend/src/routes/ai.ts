import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAssistant,
  askAssistant,
  compareProducts,
  monitorContracts,
  getRecommendations
} from '../controllers/ai';

const router = Router();

/**
 * @route   GET /api/ai/assistant
 * @desc    Get AI assistant info
 * @access  Private
 */
router.get('/assistant', authenticate, getAssistant);

/**
 * @route   POST /api/ai/ask
 * @desc    Ask AI assistant
 * @access  Private
 */
router.post('/ask', authenticate, askAssistant);

/**
 * @route   POST /api/ai/compare
 * @desc    Compare products using AI
 * @access  Private
 */
router.post('/compare', authenticate, compareProducts);

/**
 * @route   GET /api/ai/contracts
 * @desc    Get monitored contracts
 * @access  Private
 */
router.get('/contracts', authenticate, monitorContracts);

/**
 * @route   GET /api/ai/recommendations
 * @desc    Get personalized recommendations
 * @access  Private
 */
router.get('/recommendations', authenticate, getRecommendations);

export default router;

