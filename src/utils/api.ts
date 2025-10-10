import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { TokenManager } from './auth';
import { getAuthHeaders } from '@/config/api';
import { WorkType } from '@/config/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor to add authentication headers
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get current environment and token
    const environment = TokenManager.getEnvironment() as WorkType || 'development';
    const authData = TokenManager.getAuthData();

    // Add base headers for the environment
    const baseHeaders = getAuthHeaders(environment);
    
    // Add authorization header if token exists
    const authHeader = TokenManager.getAuthHeader();

    // Merge headers
    Object.assign(config.headers, baseHeaders, authHeader);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      console.warn('Token expired or invalid, clearing authentication data');
      TokenManager.clearTokens();
      
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;

// Helper function to make authenticated API calls
export const makeAuthenticatedRequest = async (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: any,
  config?: any
) => {
  const requestConfig = {
    method,
    url,
    data,
    ...config,
  };

  return apiClient(requestConfig);
};
