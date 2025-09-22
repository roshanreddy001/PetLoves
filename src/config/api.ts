/**
 * Centralized API Configuration
 * This file contains all API-related configurations and utilities
 */

// Environment-based API configuration
const getApiBaseUrl = (): string => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE;
  }
  
  // Default to production API
  return 'https://petloves-nedk.onrender.com';
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // User endpoints
  USERS: {
    LOGIN: '/api/users/login',
    REGISTER: '/api/users',
    REGISTER_ALT: '/api/users/register',
    PROFILE: '/api/users/profile',
  },
  
  // Order endpoints
  ORDERS: {
    BASE: '/api/orders',
    BY_USER: (userId: string) => `/api/orders/${userId}`,
    CREATE: '/api/orders',
  },
  
  // Adoption endpoints
  ADOPTIONS: {
    BASE: '/api/adoptions',
    BY_USER: (userId: string) => `/api/adoptions/${userId}`,
    CREATE: '/api/adoptions',
  },
  
  // Appointment endpoints
  APPOINTMENTS: {
    BASE: '/api/appointments',
    BY_USER: (userId: string) => `/api/appointments/${userId}`,
    CREATE: '/api/appointments',
  },
  
  // Visit endpoints
  VISITS: {
    BASE: '/api/visits',
    BY_USER: (userId: string) => `/api/visits/${userId}`,
    CREATE: '/api/visits',
  },
  
  // Pet endpoints
  PETS: {
    BASE: '/api/pets',
    BY_ID: (petId: string) => `/api/pets/${petId}`,
  },
  
  // Clinic endpoints
  CLINICS: {
    BASE: '/api/clinics',
    BY_ID: (clinicId: string) => `/api/clinics/${clinicId}`,
  },
} as const;

// Utility function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// HTTP Client configuration
export interface ApiRequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

// Enhanced fetch with timeout and retry logic
export const apiRequest = async (
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<Response> => {
  const {
    timeout = API_CONFIG.TIMEOUT,
    retries = API_CONFIG.RETRY_ATTEMPTS,
    ...fetchOptions
  } = options;

  const url = buildApiUrl(endpoint);
  
  // Default headers
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  const fetchWithTimeout = async (url: string, options: RequestInit): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: defaultHeaders,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  let lastError: Error;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, fetchOptions);
      
      // If successful, return the response
      if (response.ok || attempt === retries) {
        return response;
      }
      
      // If it's a client error (4xx), don't retry
      if (response.status >= 400 && response.status < 500) {
        return response;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error as Error;
      
      // If it's the last attempt, throw the error
      if (attempt === retries) {
        throw lastError;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * (attempt + 1)));
    }
  }
  
  throw lastError!;
};

// Convenience methods for common HTTP operations
export const api = {
  get: (endpoint: string, options?: ApiRequestOptions) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),
    
  post: (endpoint: string, data?: any, options?: ApiRequestOptions) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: (endpoint: string, data?: any, options?: ApiRequestOptions) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  patch: (endpoint: string, data?: any, options?: ApiRequestOptions) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: (endpoint: string, options?: ApiRequestOptions) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

// Export the base URL for backward compatibility
export const API_BASE = API_CONFIG.BASE_URL;

// Development utilities
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// API health check utility
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health');
    return response.ok;
  } catch (error) {
    console.error('API health check failed:', error);
    return false;
  }
};

// Log API configuration in development
if (isDevelopment) {
  console.log('API Configuration:', {
    baseUrl: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    retryAttempts: API_CONFIG.RETRY_ATTEMPTS,
  });
}
