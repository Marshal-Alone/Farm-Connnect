/**
 * Crop Service - Frontend API client for crop management
 */

import { FarmerCrop } from '@/lib/schemas/cropSchema';
import { API_BASE_URL } from '@/config/api';

export class CropService {
  /**
   * Get all crops for the current user
   */
  static async getCrops(): Promise<{ success: boolean; data?: FarmerCrop[]; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/crops`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('FarmConnect_token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching crops:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch crops'
      };
    }
  }

  /**
   * Get a single crop by ID
   */
  static async getCropById(cropId: string): Promise<{ success: boolean; data?: FarmerCrop; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/crops/${cropId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('FarmConnect_token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching crop:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch crop'
      };
    }
  }

  /**
   * Create a new crop
   */
  static async createCrop(cropData: Omit<FarmerCrop, '_id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; data?: FarmerCrop; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/crops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('FarmConnect_token') || ''}`
        },
        body: JSON.stringify(cropData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating crop:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create crop'
      };
    }
  }

  /**
   * Update an existing crop
   */
  static async updateCrop(cropId: string, cropData: Partial<FarmerCrop>): Promise<{ success: boolean; data?: FarmerCrop; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/crops/${cropId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('FarmConnect_token') || ''}`
        },
        body: JSON.stringify(cropData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating crop:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update crop'
      };
    }
  }

  /**
   * Delete a crop
   */
  static async deleteCrop(cropId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/crops/${cropId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('FarmConnect_token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting crop:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete crop'
      };
    }
  }
}

export default CropService;
export const cropService = CropService;
