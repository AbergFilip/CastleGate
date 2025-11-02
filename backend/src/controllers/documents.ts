import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../config/logger';
import * as dataStore from '../storage/dataStore';
import * as fs from 'fs';
import * as path from 'path';

export const uploadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, type, icon } = req.body;
    const file = (req as any).file;

    logger.info(`Uploading document for user: ${userId}`);

    // If no file is provided, use name as filename or generate one
    const filename = file ? file.filename : null;
    const originalName = file ? file.originalname : name;

    const document = {
      id: 'doc-' + Date.now(),
      userId,
      name: name || originalName,
      type,
      icon,
      filename: filename,
      originalName: originalName,
      uploadedAt: new Date().toISOString()
    };

    dataStore.saveDocument(userId, document);

    res.json({
      success: true,
      document
    });
  } catch (error) {
    logger.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload document'
    });
  }
};

export const getDocuments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const documents = dataStore.getDocuments(userId);

    res.json({
      success: true,
      documents
    });
  } catch (error) {
    logger.error('Get documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch documents'
    });
  }
};

export const getDocumentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Fetch document from database
    const document = {
      id,
      name: 'Document.pdf',
      type: 'document',
      uploadedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      document
    });
  } catch (error) {
    logger.error('Get document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch document'
    });
  }
};

export const updateDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const updateData = req.body;

    logger.info(`Updating document: ${id}`);

    const success = dataStore.updateDocument(userId, id, updateData);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      message: 'Document updated successfully'
    });
  } catch (error) {
    logger.error('Update document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update document'
    });
  }
};

export const deleteDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    logger.info(`Deleting document: ${id}`);

    // Get document to find filename
    const documents = dataStore.getDocuments(userId);
    const document = documents.find(d => d.id === id);
    
    // Delete file from filesystem if it exists
    if (document && (document as any).filename) {
      const filePath = path.join(__dirname, '../../uploads', (document as any).filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`Deleted file: ${(document as any).filename}`);
      }
    }

    const success = dataStore.deleteDocument(userId, id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    logger.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete document'
    });
  }
};

export const downloadDocument = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const documents = dataStore.getDocuments(userId);
    const document = documents.find(d => d.id === id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    const filename = (document as any).filename;
    if (!filename) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File does not exist on server'
      });
    }

    const originalName = (document as any).originalName || document.name;
    
    // Detect MIME type from file extension
    const extension = originalName.split('.').pop()?.toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif'
    };
    const contentType = mimeTypes[extension || ''] || 'application/octet-stream';
    
    // Read file and send directly to avoid header conflicts
    const fileContent = fs.readFileSync(filePath);
    
    // Set headers for proper file download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${originalName}"`);
    res.setHeader('Content-Length', fileContent.length);
    
    res.send(fileContent);
  } catch (error) {
    logger.error('Download document error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download document'
    });
  }
};

