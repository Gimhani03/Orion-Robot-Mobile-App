// Todo API utility functions for frontend
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.5:5000/api';

// Get authentication token from storage (using existing auth system)
const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken'); // Changed from 'authToken' to 'userToken'
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

const todoAPI = {
  // Get all todos for the authenticated user
  getAllTodos: async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch todos');
      }
      
      return data.data; // Return the todos array
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Create a new todo
  createTodo: async (todoData) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(todoData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create todo');
      }
      
      return data.data; // Return the created todo
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Update a todo
  updateTodo: async (todoId, updateData) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update todo');
      }
      
      return data.data; // Return the updated todo
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Toggle todo completion status
  toggleTodo: async (todoId) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/todos/${todoId}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to toggle todo');
      }
      
      return data.data; // Return the updated todo
    } catch (error) {
      console.error('Error toggling todo:', error);
      throw error;
    }
  },

  // Delete a todo
  deleteTodo: async (todoId) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete todo');
      }
      
      return true; // Return success
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  // Get todo statistics
  getTodoStats: async () => {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}/todos/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch todo stats');
      }
      
      return data.data; // Return the stats object
    } catch (error) {
      console.error('Error fetching todo stats:', error);
      throw error;
    }
  }
};

export default todoAPI;
