/**
 * Crops API Routes - Crop lifecycle and action logging
 */

import express from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase, collections } from '../config/database.js';
import { authenticateToken } from './users.js';

const router = express.Router();

const COLLECTIONS = {
  CROPS: 'farmerCrops',
  ACTIONS: 'cropActions'
};

// ============================================================================
// CROP ROUTES
// ============================================================================

/**
 * GET /api/crops - Get all crops for current user
 */
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase();
    const cropsCollection = db.collection(COLLECTIONS.CROPS);

    const crops = await cropsCollection
      .find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      data: crops
    });
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch crops'
    });
  }
});

/**
 * GET /api/crops/:cropId - Get single crop by ID
 */
router.get('/:cropId', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase();
    const cropsCollection = db.collection(COLLECTIONS.CROPS);

    const crop = await cropsCollection.findOne({
      _id: new ObjectId(req.params.cropId),
      userId: req.user.userId
    });

    if (!crop) {
      return res.status(404).json({
        success: false,
        error: 'Crop not found'
      });
    }

    res.json({
      success: true,
      data: crop
    });
  } catch (error) {
    console.error('Error fetching crop:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch crop'
    });
  }
});

/**
 * POST /api/crops - Create new crop
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { cropName, variety, sowDate, sowingArea, fieldLocation, expectedHarvestDate, notes, status } = req.body;

    // Validation
    if (!cropName || !sowDate || !sowingArea) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: cropName, sowDate, sowingArea'
      });
    }

    const db = await getDatabase();
    const cropsCollection = db.collection(COLLECTIONS.CROPS);

    const newCrop = {
      userId: req.user.userId,
      cropName,
      variety: variety || '',
      sowDate: new Date(sowDate),
      sowingArea: parseFloat(sowingArea),
      fieldLocation: fieldLocation || { lat: 0, lon: 0, address: '' },
      status: status || 'growing',
      expectedHarvestDate: expectedHarvestDate ? new Date(expectedHarvestDate) : null,
      harvestDate: null,
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await cropsCollection.insertOne(newCrop);

    res.status(201).json({
      success: true,
      data: {
        ...newCrop,
        _id: result.insertedId
      }
    });
  } catch (error) {
    console.error('Error creating crop:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create crop'
    });
  }
});

/**
 * PUT /api/crops/:cropId - Update crop
 */
router.put('/:cropId', authenticateToken, async (req, res) => {
  try {
    const { cropName, variety, sowDate, sowingArea, fieldLocation, expectedHarvestDate, harvestDate, status, notes } = req.body;

    const db = await getDatabase();
    const cropsCollection = db.collection(COLLECTIONS.CROPS);

    const updateData = {
      updatedAt: new Date()
    };

    if (cropName !== undefined) updateData.cropName = cropName;
    if (variety !== undefined) updateData.variety = variety;
    if (sowDate !== undefined) updateData.sowDate = new Date(sowDate);
    if (sowingArea !== undefined) updateData.sowingArea = parseFloat(sowingArea);
    if (fieldLocation !== undefined) updateData.fieldLocation = fieldLocation;
    if (expectedHarvestDate !== undefined) updateData.expectedHarvestDate = expectedHarvestDate ? new Date(expectedHarvestDate) : null;
    if (harvestDate !== undefined) updateData.harvestDate = harvestDate ? new Date(harvestDate) : null;
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    const result = await cropsCollection.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.cropId),
        userId: req.user.userId
      },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return res.status(404).json({
        success: false,
        error: 'Crop not found'
      });
    }

    res.json({
      success: true,
      data: result.value
    });
  } catch (error) {
    console.error('Error updating crop:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update crop'
    });
  }
});

/**
 * DELETE /api/crops/:cropId - Delete crop (and associated actions)
 */
router.delete('/:cropId', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase();
    const cropsCollection = db.collection(COLLECTIONS.CROPS);
    const actionsCollection = db.collection(COLLECTIONS.ACTIONS);

    const cropId = new ObjectId(req.params.cropId);

    // Delete crop
    const cropResult = await cropsCollection.deleteOne({
      _id: cropId,
      userId: req.user.userId
    });

    if (cropResult.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Crop not found'
      });
    }

    // Delete associated actions
    await actionsCollection.deleteMany({
      cropId: cropId,
      userId: req.user.userId
    });

    res.json({
      success: true,
      message: 'Crop deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting crop:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete crop'
    });
  }
});

// ============================================================================
// CROP ACTION ROUTES
// ============================================================================

/**
 * GET /api/crops/:cropId/actions - Get all actions for a crop
 */
router.get('/:cropId/actions', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase();
    const actionsCollection = db.collection(COLLECTIONS.ACTIONS);

    const actions = await actionsCollection
      .find({
        cropId: new ObjectId(req.params.cropId),
        userId: req.user.userId
      })
      .sort({ actionDate: -1 })
      .toArray();

    res.json({
      success: true,
      data: actions
    });
  } catch (error) {
    console.error('Error fetching actions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch actions'
    });
  }
});

/**
 * POST /api/crops/:cropId/actions - Log new action
 */
router.post('/:cropId/actions', authenticateToken, async (req, res) => {
  try {
    const { actionType, actionDate, details, quantity, quantityUnit } = req.body;
    const cropId = req.params.cropId;

    if (!actionType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: actionType'
      });
    }

    const db = await getDatabase();
    const actionsCollection = db.collection(COLLECTIONS.ACTIONS);

    const newAction = {
      userId: req.user.userId,
      cropId: new ObjectId(cropId),
      actionType,
      actionDate: actionDate ? new Date(actionDate) : new Date(),
      details: details || '',
      quantity: quantity ? parseFloat(quantity) : null,
      quantityUnit: quantityUnit || null,
      weather: null, // Can be populated from weather API if needed
      createdAt: new Date()
    };

    const result = await actionsCollection.insertOne(newAction);

    res.status(201).json({
      success: true,
      data: {
        ...newAction,
        _id: result.insertedId
      }
    });
  } catch (error) {
    console.error('Error logging action:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to log action'
    });
  }
});

/**
 * DELETE /api/crops/actions/:actionId - Delete an action
 */
router.delete('/actions/:actionId', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase();
    const actionsCollection = db.collection(COLLECTIONS.ACTIONS);

    const result = await actionsCollection.deleteOne({
      _id: new ObjectId(req.params.actionId),
      userId: req.user.userId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Action not found'
      });
    }

    res.json({
      success: true,
      message: 'Action deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting action:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete action'
    });
  }
});

// Backward-compatible endpoint for older clients
router.delete('/:actionId/delete', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase();
    const actionsCollection = db.collection(COLLECTIONS.ACTIONS);

    const result = await actionsCollection.deleteOne({
      _id: new ObjectId(req.params.actionId),
      userId: req.user.userId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Action not found'
      });
    }

    res.json({
      success: true,
      message: 'Action deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting action:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete action'
    });
  }
});

/**
 * GET /api/actions/recent - Get recent actions across all crops (last 30 days)
 */
router.get('/actions/recent', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase();
    const actionsCollection = db.collection(COLLECTIONS.ACTIONS);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const actions = await actionsCollection
      .find({
        userId: req.user.userId,
        actionDate: { $gte: thirtyDaysAgo }
      })
      .sort({ actionDate: -1 })
      .toArray();

    res.json({
      success: true,
      data: actions
    });
  } catch (error) {
    console.error('Error fetching recent actions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent actions'
    });
  }
});

export default router;
