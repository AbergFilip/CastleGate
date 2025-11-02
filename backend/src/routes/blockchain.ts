import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  generatePrivateKey,
  getWalletAddress,
  createSmartContract,
  executeContract,
  getCastlegateCoinsBalance,
  transferCoins
} from '../controllers/blockchain';

const router = Router();

/**
 * @route   POST /api/blockchain/wallet/generate
 * @desc    Generate new wallet with private key
 * @access  Private
 */
router.post('/wallet/generate', authenticate, generatePrivateKey);

/**
 * @route   GET /api/blockchain/wallet/address
 * @desc    Get user wallet address
 * @access  Private
 */
router.get('/wallet/address', authenticate, getWalletAddress);

/**
 * @route   POST /api/blockchain/contract/create
 * @desc    Create smart contract
 * @access  Private
 */
router.post('/contract/create', authenticate, createSmartContract);

/**
 * @route   POST /api/blockchain/contract/execute
 * @desc    Execute smart contract
 * @access  Private
 */
router.post('/contract/execute', authenticate, executeContract);

/**
 * @route   GET /api/blockchain/coins/balance
 * @desc    Get Castlegate Coins balance
 * @access  Private
 */
router.get('/coins/balance', authenticate, getCastlegateCoinsBalance);

/**
 * @route   POST /api/blockchain/coins/transfer
 * @desc    Transfer Castlegate Coins
 * @access  Private
 */
router.post('/coins/transfer', authenticate, transferCoins);

export default router;

