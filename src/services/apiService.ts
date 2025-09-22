/**
 * API Service Layer
 * This file contains high-level API service functions for different domains
 */

import { api, API_ENDPOINTS } from '../config/api';

// Import existing types
import { User } from '../types';

// Additional API-specific types
export interface ApiUser extends Omit<User, 'password' | 'createdAt'> {
  _id?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

// Error handling utility
const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  try {
    const data = await response.json();
    
    if (response.ok) {
      return {
        success: true,
        data,
        status: response.status,
      };
    } else {
      return {
        success: false,
        error: data.error || data.message || 'An error occurred',
        status: response.status,
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Failed to parse response',
      status: response.status,
    };
  }
};

// User Service
export const userService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<ApiUser>> {
    try {
      const response = await api.post(API_ENDPOINTS.USERS.LOGIN, credentials);
      const result = await handleApiResponse<ApiUser>(response);
      
      if (result.success && result.data) {
        // Ensure the user object has an 'id' field
        if (!result.data.id && result.data._id) {
          result.data.id = result.data._id;
        }
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  },

  async register(userData: RegisterData): Promise<ApiResponse<ApiUser>> {
    try {
      const response = await api.post(API_ENDPOINTS.USERS.REGISTER, userData, {
        timeout: 10000,
      });
      return await handleApiResponse<ApiUser>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  },

  async getProfile(userId: string): Promise<ApiResponse<ApiUser>> {
    try {
      const response = await api.get(`${API_ENDPOINTS.USERS.PROFILE}/${userId}`);
      return await handleApiResponse<ApiUser>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  },
};

// Activity Service
export const activityService = {
  async getUserOrders(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get(API_ENDPOINTS.ORDERS.BY_USER(userId));
      return await handleApiResponse<any[]>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
      };
    }
  },

  async getUserAdoptions(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get(API_ENDPOINTS.ADOPTIONS.BY_USER(userId));
      return await handleApiResponse<any[]>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch adoptions',
      };
    }
  },

  async getUserAppointments(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get(API_ENDPOINTS.APPOINTMENTS.BY_USER(userId));
      return await handleApiResponse<any[]>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch appointments',
      };
    }
  },

  async getUserVisits(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const response = await api.get(API_ENDPOINTS.VISITS.BY_USER(userId));
      return await handleApiResponse<any[]>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch visits',
      };
    }
  },

  async createOrder(orderData: any): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(API_ENDPOINTS.ORDERS.CREATE, orderData);
      return await handleApiResponse<any>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create order',
      };
    }
  },

  async createAdoption(adoptionData: any): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(API_ENDPOINTS.ADOPTIONS.CREATE, adoptionData);
      return await handleApiResponse<any>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create adoption',
      };
    }
  },

  async createAppointment(appointmentData: any): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(API_ENDPOINTS.APPOINTMENTS.CREATE, appointmentData);
      return await handleApiResponse<any>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create appointment',
      };
    }
  },

  async createVisit(visitData: any): Promise<ApiResponse<any>> {
    try {
      const response = await api.post(API_ENDPOINTS.VISITS.CREATE, visitData);
      return await handleApiResponse<any>(response);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create visit',
      };
    }
  },
};

// Batch operations for fetching all user activities
export const batchActivityService = {
  async getAllUserActivities(userId: string): Promise<{
    orders: ApiResponse<any[]>;
    adoptions: ApiResponse<any[]>;
    appointments: ApiResponse<any[]>;
    visits: ApiResponse<any[]>;
  }> {
    const [orders, adoptions, appointments, visits] = await Promise.allSettled([
      activityService.getUserOrders(userId),
      activityService.getUserAdoptions(userId),
      activityService.getUserAppointments(userId),
      activityService.getUserVisits(userId),
    ]);

    return {
      orders: orders.status === 'fulfilled' ? orders.value : { success: false, error: 'Failed to fetch orders' },
      adoptions: adoptions.status === 'fulfilled' ? adoptions.value : { success: false, error: 'Failed to fetch adoptions' },
      appointments: appointments.status === 'fulfilled' ? appointments.value : { success: false, error: 'Failed to fetch appointments' },
      visits: visits.status === 'fulfilled' ? visits.value : { success: false, error: 'Failed to fetch visits' },
    };
  },
};

// Export all services
export default {
  user: userService,
  activity: activityService,
  batch: batchActivityService,
};
