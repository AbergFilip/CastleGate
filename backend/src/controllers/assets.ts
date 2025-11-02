import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { logger } from '../config/logger';
import * as dataStore from '../storage/dataStore';

export const createAsset = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, provider, type, value, purchase, icon } = req.body;

    logger.info(`Creating asset for user: ${userId}`);

    const asset = {
      id: 'asset-' + Date.now(),
      userId,
      name,
      provider,
      type,
      value,
      purchase,
      icon,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    dataStore.saveAsset(userId, asset);

    res.json({
      success: true,
      asset
    });
  } catch (error) {
    logger.error('Create asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create asset'
    });
  }
};

export const getAssets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    const assets = dataStore.getAssets(userId);

    res.json({
      success: true,
      assets
    });
  } catch (error) {
    logger.error('Get assets error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assets'
    });
  }
};

export const getAssetById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // TODO: Fetch asset from database
    const asset = {
      id,
      name: 'Asset',
      provider: 'Provider',
      type: 'type',
      value: '0 kr',
      purchase: new Date().toISOString(),
      status: 'active'
    };

    res.json({
      success: true,
      asset
    });
  } catch (error) {
    logger.error('Get asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch asset'
    });
  }
};

export const updateAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const updateData = req.body;

    logger.info(`Updating asset: ${id}`);

    const success = dataStore.updateAsset(userId, id, updateData);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    res.json({
      success: true,
      message: 'Asset updated successfully'
    });
  } catch (error) {
    logger.error('Update asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update asset'
    });
  }
};

export const deleteAsset = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    logger.info(`Deleting asset: ${id}`);

    const success = dataStore.deleteAsset(userId, id);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    res.json({
      success: true,
      message: 'Asset deleted successfully'
    });
  } catch (error) {
    logger.error('Delete asset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete asset'
    });
  }
};

