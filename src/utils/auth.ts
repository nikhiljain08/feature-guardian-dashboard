import { UserData } from '@/types/user';

export interface AuthTokens {
  jwt: string;
  environment: string;
}

export class TokenManager {
  private static readonly TOKEN_KEY = 'token';
  private static readonly ENV_KEY = 'env';
  private static readonly USER_KEY = 'user';

  /**
   * Store user session data
   */
  static setUserData(userData: UserData): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
  }

  /**
   * Get user data
   */
  static getUserData(): UserData | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Store JWT token and environment in localStorage
   */
  static setTokens(jwt: string, environment: string, userData?: UserData): void {
    localStorage.setItem(this.TOKEN_KEY, jwt);
    localStorage.setItem(this.ENV_KEY, environment);
    if (userData) {
        this.setUserData(userData);
      }
  }

  /**
   * Get JWT token from localStorage
   */
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get environment from localStorage
   */
  static getEnvironment(): string | null {
    return localStorage.getItem(this.ENV_KEY);
  }

  /**
   * Get both token and environment
   */
  static getAuthData(): AuthTokens | null {
    const jwt = this.getToken();
    const environment = this.getEnvironment();
    
    if (jwt && environment) {
      return { jwt, environment };
    }
    
    return null;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && token !== '';
  }

  /**
   * Clear all authentication data
   */
  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ENV_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  /**
   * Get authorization header for API calls
   */
  static getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
