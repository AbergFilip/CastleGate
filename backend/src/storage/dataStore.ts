import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../config/logger';

const DATA_DIR = path.join(__dirname, '../../data');
const DOCUMENTS_FILE = path.join(DATA_DIR, 'documents.json');
const ASSETS_FILE = path.join(DATA_DIR, 'assets.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize empty files if they don't exist
if (!fs.existsSync(DOCUMENTS_FILE)) {
  fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify({}, null, 2));
}

if (!fs.existsSync(ASSETS_FILE)) {
  fs.writeFileSync(ASSETS_FILE, JSON.stringify({}, null, 2));
}

interface Document {
  id: string;
  userId: string;
  name: string;
  type: string;
  icon?: string;
  filename?: string;
  originalName?: string;
  uploadedAt: string;
  updatedAt?: string;
}

interface Asset {
  id: string;
  userId: string;
  name: string;
  provider: string;
  type: string;
  value: string;
  purchase: string;
  icon?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

// Documents storage
export const getDocuments = (userId: string): Document[] => {
  try {
    const data = fs.readFileSync(DOCUMENTS_FILE, 'utf8');
    const allDocuments = JSON.parse(data);
    return allDocuments[userId] || [];
  } catch (error) {
    logger.error('Error reading documents:', error);
    return [];
  }
};

export const saveDocument = (userId: string, document: Document): void => {
  try {
    const data = fs.readFileSync(DOCUMENTS_FILE, 'utf8');
    const allDocuments = JSON.parse(data);
    if (!allDocuments[userId]) {
      allDocuments[userId] = [];
    }
    allDocuments[userId].push(document);
    fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(allDocuments, null, 2));
  } catch (error) {
    logger.error('Error saving document:', error);
    throw error;
  }
};

export const updateDocument = (userId: string, documentId: string, updates: Partial<Document>): boolean => {
  try {
    const data = fs.readFileSync(DOCUMENTS_FILE, 'utf8');
    const allDocuments = JSON.parse(data);
    if (!allDocuments[userId]) {
      return false;
    }
    const index = allDocuments[userId].findIndex((doc: Document) => doc.id === documentId);
    if (index === -1) {
      return false;
    }
    allDocuments[userId][index] = { ...allDocuments[userId][index], ...updates, updatedAt: new Date().toISOString() };
    fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(allDocuments, null, 2));
    return true;
  } catch (error) {
    logger.error('Error updating document:', error);
    return false;
  }
};

export const deleteDocument = (userId: string, documentId: string): boolean => {
  try {
    const data = fs.readFileSync(DOCUMENTS_FILE, 'utf8');
    const allDocuments = JSON.parse(data);
    if (!allDocuments[userId]) {
      return false;
    }
    allDocuments[userId] = allDocuments[userId].filter((doc: Document) => doc.id !== documentId);
    fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(allDocuments, null, 2));
    return true;
  } catch (error) {
    logger.error('Error deleting document:', error);
    return false;
  }
};

// Assets storage
export const getAssets = (userId: string): Asset[] => {
  try {
    const data = fs.readFileSync(ASSETS_FILE, 'utf8');
    const allAssets = JSON.parse(data);
    return allAssets[userId] || [];
  } catch (error) {
    logger.error('Error reading assets:', error);
    return [];
  }
};

export const saveAsset = (userId: string, asset: Asset): void => {
  try {
    const data = fs.readFileSync(ASSETS_FILE, 'utf8');
    const allAssets = JSON.parse(data);
    if (!allAssets[userId]) {
      allAssets[userId] = [];
    }
    allAssets[userId].push(asset);
    fs.writeFileSync(ASSETS_FILE, JSON.stringify(allAssets, null, 2));
  } catch (error) {
    logger.error('Error saving asset:', error);
    throw error;
  }
};

export const updateAsset = (userId: string, assetId: string, updates: Partial<Asset>): boolean => {
  try {
    const data = fs.readFileSync(ASSETS_FILE, 'utf8');
    const allAssets = JSON.parse(data);
    if (!allAssets[userId]) {
      return false;
    }
    const index = allAssets[userId].findIndex((asset: Asset) => asset.id === assetId);
    if (index === -1) {
      return false;
    }
    allAssets[userId][index] = { ...allAssets[userId][index], ...updates, updatedAt: new Date().toISOString() };
    fs.writeFileSync(ASSETS_FILE, JSON.stringify(allAssets, null, 2));
    return true;
  } catch (error) {
    logger.error('Error updating asset:', error);
    return false;
  }
};

export const deleteAsset = (userId: string, assetId: string): boolean => {
  try {
    const data = fs.readFileSync(ASSETS_FILE, 'utf8');
    const allAssets = JSON.parse(data);
    if (!allAssets[userId]) {
      return false;
    }
    allAssets[userId] = allAssets[userId].filter((asset: Asset) => asset.id !== assetId);
    fs.writeFileSync(ASSETS_FILE, JSON.stringify(allAssets, null, 2));
    return true;
  } catch (error) {
    logger.error('Error deleting asset:', error);
    return false;
  }
};

