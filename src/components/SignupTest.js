// Simple signup test component
// Add this temporarily to test the exact signup API call

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const SignupTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('Ready to test');

  const testSignup = async () => {
    setIsLoading(true);
    setStatus('Testing signup...');

    try {
      const url = 'http://192.168.1.3:5000/api/auth/register';
      console.log('🔗 Testing signup to:', url);

      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      console.log('📝 Sending data:', testData);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📦 Response data:', data);

      if (response.ok && data.success) {
        setStatus('✅ Signup successful!');
        Alert.alert('Success!', `User created: ${data.user.name}`);
      } else {
        setStatus(`❌ Failed: ${data.message}`);
        Alert.alert('Failed', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setStatus(`❌ Error: ${error.message}`);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup API Test</Text>
      <Text style={styles.status}>Status: {status}</Text>
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={testSignup}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Testing...' : 'Test Signup API'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f8ff',
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007AFF',
  },
  status: {
    fontSize: 12,
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default SignupTest;
