import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.5:5000/api'; // Update with your server IP

class ChatAPI {
  // Get authentication token
  async getToken() {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  // Get chat history
  async getChatHistory() {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/chat/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get chat history');
      }

      return data.data.messages;
    } catch (error) {
      console.error('Error getting chat history:', error);
      throw error;
    }
  }

  // Save chat message
  async saveMessage(text, isBot = false, timestamp = null) {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          isBot,
          timestamp: timestamp || new Date().toISOString(),
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save message');
      }

      return data.data;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }

  // Clear chat history
  async clearChatHistory() {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/chat/history`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to clear chat history');
      }

      return data;
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }

  // Get chat statistics
  async getChatStats() {
    try {
      const token = await this.getToken();
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_BASE_URL}/chat/stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to get chat stats');
      }

      return data.data;
    } catch (error) {
      console.error('Error getting chat stats:', error);
      throw error;
    }
  }

  // Save conversation batch (multiple messages at once)
  async saveConversation(messages) {
    try {
      const promises = messages.map(message => 
        this.saveMessage(message.text, message.isBot, message.timestamp)
      );
      
      const results = await Promise.allSettled(promises);
      
      const successful = results.filter(result => result.status === 'fulfilled');
      const failed = results.filter(result => result.status === 'rejected');
      
      console.log(`Saved ${successful.length} messages, ${failed.length} failed`);
      
      return {
        successful: successful.length,
        failed: failed.length,
        results
      };
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  }
}

export default new ChatAPI();
