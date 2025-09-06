import React from 'react';
import { View, Text,Image, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Logo and Brand */}
      <View style={styles.logoContainer}>
        
          {/* Robot Icon Placeholder */}
          <View style={styles.robotIcon}>
            <Image source={require('../../assets/logo.png')} style={{ width: 200, height: 200, borderRadius: 15 }} />
          </View>
        
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity 
        style={styles.signUpButton}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.signUpButtonText}>SIGN UP</Text>
      </TouchableOpacity>

      {/* Sign In Link */}
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>ALREADY HAVE AN ACCOUNT? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={styles.signInLink}>LOG IN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d6d6d6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  
  robotIcon: {
    width: 48,
    height: 48,

    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  robotEmoji: {
    color: '#6b7280',
    fontSize: 12,
  },
  brandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  signUpButton: {
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 16,
    marginTop: 52,
    alignItems: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 18,
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInText: {
    color: '#6b7280',
  },
  signInLink: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
