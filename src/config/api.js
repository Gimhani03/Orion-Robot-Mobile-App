// API Configuration and Helper Functions
// src/config/api.js

// Base URL for your backend API - Physical Device Configuration
const API_BASE_URL = 'http://192.168.1.5:5000/api'; // Corrected to actual computer IP address

console.log('🔧 API Base URL configured as:', API_BASE_URL);

export const API_ENDPOINTS = {
  // Authentication
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  
  // User
  USER_PROFILE: `${API_BASE_URL}/user/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/user/profile`,
  DELETE_ACCOUNT: `${API_BASE_URL}/user/profile`,
  
  // Profile
  UPLOAD_AVATAR: `${API_BASE_URL}/profile/upload-avatar`,
  UPDATE_PROFILE_DATA: `${API_BASE_URL}/profile/update`,
  
  // Reviews
  REVIEWS: `${API_BASE_URL}/reviews`,
  REVIEW_BY_ID: (id) => `${API_BASE_URL}/reviews/${id}`,
  
  // Health Check
  HEALTH: `${API_BASE_URL}/health`,
};

// Generic API call helper
export const apiCall = async (endpoint, options = {}) => {
  try {
    console.log('🔗 Making API call to:', endpoint);
    console.log('📝 Options:', JSON.stringify(options, null, 2));
    
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    console.log('📡 Response status:', response.status);
    
    const data = await response.json();
    console.log('📦 Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    console.error('🔍 Error details:', {
      message: error.message,
      endpoint,
      options
    });
    throw error;
  }
};

// Authentication API functions
export const authAPI = {
  register: async (userData) => {
    return apiCall(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  login: async (credentials) => {
    return apiCall(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  forgotPassword: async (email) => {
    return apiCall(API_ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

// User API functions
export const userAPI = {
  getProfile: async (token) => {
    return apiCall(API_ENDPOINTS.USER_PROFILE, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  
  updateProfile: async (userData, token) => {
    return apiCall(API_ENDPOINTS.UPDATE_PROFILE, {
      method: 'PATCH', // Changed to PATCH to match backend
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(userData),
    });
  },
  
  deleteAccount: async (token) => {
    return apiCall(API_ENDPOINTS.DELETE_ACCOUNT, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// Profile API functions
export const profileAPI = {
  uploadAvatar: async (formData, token) => {
    return apiCall(API_ENDPOINTS.UPLOAD_AVATAR, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type for FormData, let fetch set it
      },
      body: formData,
    });
  },
  
  updateProfileData: async (profileData, token) => {
    return apiCall(API_ENDPOINTS.UPDATE_PROFILE_DATA, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(profileData),
    });
  },
};

// Reviews API functions
export const reviewsAPI = {
  getAllReviews: async (token = null) => {
    return apiCall(API_ENDPOINTS.REVIEWS, {
      method: 'GET',
    });
  },
  
  createReview: async (reviewData, token = null) => {
    return apiCall(API_ENDPOINTS.REVIEWS, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },
  
  updateReview: async (reviewId, reviewData, token = null) => {
    return apiCall(API_ENDPOINTS.REVIEW_BY_ID(reviewId), {
      method: 'PATCH',
      body: JSON.stringify(reviewData),
    });
  },
  
  deleteReview: async (reviewId, token = null) => {
    return apiCall(API_ENDPOINTS.REVIEW_BY_ID(reviewId), {
      method: 'DELETE',
    });
  },
};

// Health check function
export const healthCheck = async () => {
  return apiCall(API_ENDPOINTS.HEALTH, {
    method: 'GET',
  });
};

// Helper function to generate a mock JWT token
// This creates a basic JWT-like token for testing
const generateMockJWT = () => {
  // Create a simple mock JWT structure (header.payload.signature)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    id: 'mock-user-' + Date.now(), 
    email: 'test@example.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
  }));
  const signature = btoa('mock-signature-' + Date.now());
  
  return `${header}.${payload}.${signature}`;
};
