import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { authAPI } from '../config/api';
import { useAuth } from '../context/AuthContext';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSignIn = async () => {
    // Validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setIsLoading(true);

    try {
      // Call backend API
      const response = await authAPI.login({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (response.success) {
        // Save user data and token - backend returns user in response.data.user
        const userData = response.data?.user || response.user;
        await login(userData, response.token);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed', 
        error.message || 'Invalid email or password'
      );
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
      <Text style={styles.header}>Welcome Back!</Text>

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
        <Text style={styles.dividerText}>OR LOG IN WITH EMAIL</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      {/* Sign In Button */}
      <TouchableOpacity 
        style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.signInButtonText}>LOG IN</Text>
        )}
      </TouchableOpacity>

      {/* Forgot Password */}
      <TouchableOpacity 
        style={styles.forgotPassword}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <View style={styles.signUpContainer}>
        <Text style={styles.signUpText}>ALREADY HAVE AN ACCOUNT? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.signUpLink}>SIGN UP</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 16,
  },
  signInButton: {
    backgroundColor: 'black',
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 24,
  },
  signInButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  signInButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
  forgotPassword: {
    alignItems: 'center',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: '#2563eb',
  },
  signUpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#6b7280',
  },
  signUpLink: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
