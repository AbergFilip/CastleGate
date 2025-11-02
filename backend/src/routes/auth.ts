import { Router } from 'express';
import { authenticateBankID, verifyBankIDToken } from '../controllers/auth';

const router = Router();

/**
 * @route   POST /api/auth/bankid
 * @desc    Initiate BankID authentication
 * @access  Public
 */
router.post('/bankid', authenticateBankID);

/**
 * @route   POST /api/auth/bankid/verify
 * @desc    Verify BankID token
 * @access  Public
 */
router.post('/bankid/verify', verifyBankIDToken);

export default router;

