import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { upload } from '../config/multer';
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  updateDocument,
  downloadDocument
} from '../controllers/documents';

const router = Router();

/**
 * @route   POST /api/documents
 * @desc    Upload a document
 * @access  Private
 */
router.post('/', authenticate, upload.single('file'), uploadDocument);

/**
 * @route   GET /api/documents
 * @desc    Get all user documents
 * @access  Private
 */
router.get('/', authenticate, getDocuments);

/**
 * @route   GET /api/documents/:id/download
 * @desc    Download document file
 * @access  Private
 */
router.get('/:id/download', authenticate, downloadDocument);

/**
 * @route   PUT /api/documents/:id
 * @desc    Update document
 * @access  Private
 */
router.put('/:id', authenticate, updateDocument);

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete document
 * @access  Private
 */
router.delete('/:id', authenticate, deleteDocument);

export default router;

