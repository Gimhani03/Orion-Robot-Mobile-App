import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { authAPI } from '../config/api';
import { useAuth } from '../context/AuthContext';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSignUp = async () => {
    console.log('🚀 Starting signup process...');
    
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (!agreedToTerms) {
      Alert.alert('Terms Required', 'Please agree to the Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      console.log('📝 User data:', { name: name.trim(), email: email.trim().toLowerCase() });
      
      // First, let's test the basic fetch without our API helper
      const testUrl = 'http://192.168.1.5:5000/api/health';
      console.log('🔗 Testing connection to:', testUrl);
      
      const healthResponse = await fetch(testUrl);
      console.log('✅ Health check response:', healthResponse.status);
      
      if (!healthResponse.ok) {
        throw new Error('Backend server is not responding');
      }
      
      // Now try the actual registration
      console.log('📡 Attempting registration...');
      const response = await authAPI.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (response.success) {
        // Save user data and token - backend returns user in response.data.user
        const userData = response.data?.user || response.user;
        
        if (!userData) {
          throw new Error('No user data received from server');
        }
        
        await login(userData, response.token);
        
        Alert.alert(
          'Success!', 
          `Welcome ${userData.name}! Your account has been created.`,
          [
            {
              text: 'Continue',
              onPress: () => navigation.navigate('Home')
            }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Signup error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      let errorMessage = 'Something went wrong. Please try again.';
      
      if (error.message.includes('Network request failed')) {
        errorMessage = 'Cannot connect to server. Please check:\n\n1. Backend server is running\n2. Your device is on the same network\n3. Try refreshing the app';
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Connection error. Make sure the backend server is running.';
      } else {
        errorMessage = error.message;
      }
      
      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    Alert.alert('Social Login', `${provider} login would be implemented here`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Header */}
      <Text style={styles.header}>Create your account</Text>

      {/* Social Login Buttons */}
      <TouchableOpacity 
        style={styles.facebookButton}
        onPress={() => handleSocialLogin('Facebook')}
      >
        <Text style={styles.facebookButtonText}>CONTINUE WITH FACEBOOK</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.googleButton}
        onPress={() => handleSocialLogin('Google')}
      >
        <Text style={styles.googleButtonText}>CONTINUE WITH GOOGLE</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR SIGN UP WITH EMAIL</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        editable={!isLoading}
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="••••••••"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!isLoading}
      />

      {/* Privacy Policy Checkbox */}
      <View style={styles.checkboxContainer}>
        <TouchableOpacity 
          style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}
          onPress={() => setAgreedToTerms(!agreedToTerms)}
        >
          {agreedToTerms && <Ionicons name="checkmark" size={16} color="white" />}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>
          I have read the <Text style={styles.privacyLink}>Privacy Policy</Text>
        </Text>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity 
        style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
        onPress={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.signUpButtonText}>SIGN UP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 32,
    paddingTop: 64,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
  },
  facebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 16,
  },
  facebookButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 32,
  },
  googleButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d1d5db',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6b7280',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkboxText: {
    color: '#6b7280',
    flex: 1,
  },
  privacyLink: {
    color: '#2563eb',
  },
  signUpButton: {
    backgroundColor: 'black',
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 24,
  },
  signUpButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  signUpButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
});
