import apiClient from '@/utils/api';
import { getFeatureFlagUrl } from '@/config/api';
import { FeatureFlag } from '@/types';
import { TokenManager } from '@/utils/auth';

export class FeatureFlagsService {
  /**
   * Fetch all feature flags for the current environment
   */
  static async getFeatureFlags(): Promise<FeatureFlag[]> {
    try {
      const environment = TokenManager.getEnvironment() || 'development';
      const url = getFeatureFlagUrl('list', environment as any);
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching feature flags:', error);
      throw error;
    }
  }

  /**
   * Create a new feature flag
   */
  static async createFeatureFlag(flag: Omit<FeatureFlag, 'id'>): Promise<FeatureFlag> {
    try {
      const environment = TokenManager.getEnvironment() || 'development';
      const url = getFeatureFlagUrl('create', environment as any);
      
      const response = await apiClient.post(url, flag);
      return response.data;
    } catch (error) {
      console.error('Error creating feature flag:', error);
      throw error;
    }
  }

  /**
   * Update an existing feature flag
   */
  static async updateFeatureFlag(flag: FeatureFlag): Promise<FeatureFlag> {
    try {
      const environment = TokenManager.getEnvironment() || 'development';
      const url = getFeatureFlagUrl('update', environment as any);
      
      const response = await apiClient.put(`${url}/${flag.id}`, flag);
      return response.data;
    } catch (error) {
      console.error('Error updating feature flag:', error);
      throw error;
    }
  }

  /**
   * Delete a feature flag
   */
  static async deleteFeatureFlag(flagId: string): Promise<void> {
    try {
      const environment = TokenManager.getEnvironment() || 'development';
      const url = getFeatureFlagUrl('delete', environment as any);
      
      await apiClient.delete(`${url}/${flagId}`);
    } catch (error) {
      console.error('Error deleting feature flag:', error);
      throw error;
    }
  }
}

export default FeatureFlagsService;
