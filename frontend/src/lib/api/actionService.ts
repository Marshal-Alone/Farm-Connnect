/**
 * Crop Action Service - Frontend API client for action logging
 */

import { CropAction } from '@/lib/schemas/cropSchema';

const API_BASE_URL = '/api/crops';

export class ActionService {
  /**
   * Get all actions for a specific crop
   */
  static async getActions(cropId: string): Promise<{ success: boolean; data?: CropAction[]; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/${cropId}/actions`, {
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
      console.error('Error fetching actions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch actions'
      };
    }
  }

  /**
   * Log a new action for a crop
   */
  static async logAction(
    cropId: string,
    actionData: Omit<CropAction, '_id' | 'userId' | 'cropId' | 'createdAt'>
  ): Promise<{ success: boolean; data?: CropAction; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/${cropId}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('FarmConnect_token') || ''}`
        },
        body: JSON.stringify(actionData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error logging action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to log action'
      };
    }
  }

  /**
   * Get recent actions across all crops for context (last 30 days)
   */
  static async getRecentActions(): Promise<{ success: boolean; data?: CropAction[]; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/actions/recent`, {
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
      console.error('Error fetching recent actions:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recent actions'
      };
    }
  }

  /**
   * Delete an action
   */
  static async deleteAction(actionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/actions/${actionId}`, {
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
      console.error('Error deleting action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete action'
      };
    }
  }
}

export default ActionService;
export const actionService = ActionService;
