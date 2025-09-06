import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <Text style={styles.welcomeText}>Welcome to the</Text>
      <Text style={styles.appNameText}>ORION ROBOT APP</Text>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        {/* Background decorative elements */}
        <View style={styles.decorativeElement1} />
        <View style={styles.decorativeElement2} />
        <View style={styles.decorativeElement3} />
        
        {/* Main illustration - robot figure */}
        <View style={styles.robotContainer}>
         
         <Image source={require('../../assets/homelogo.png')} style={{ width: 280, height: 230, borderRadius: 15 }} />
          
          
        </View>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity 
        style={styles.getStartedButton}
        onPress={() => navigation.navigate('ChooseTopic')}
      >
        <Text style={styles.getStartedButtonText}>GET STARTED</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  appNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
  },
  illustrationContainer: {
    width: 375,
    height: 256,
   
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeElement1: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    width: 32,
    height: 32,
    backgroundColor: '#60a5fa',
    borderRadius: 16,
    opacity: 0.8,
  },
  decorativeElement2: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    backgroundColor: '#facc15',
    borderRadius: 12,
    opacity: 0.8,
  },
  decorativeElement3: {
    position: 'absolute',
    bottom: 32,
    right: 32,
    width: 16,
    height: 16,
    backgroundColor: '#4ade80',
    borderRadius: 8,
    opacity: 0.8,
  },
  robotContainer: {
    alignItems: 'center',
  },
  robotCircle: {
    width: 128,
    height: 128,
    backgroundColor: '#3b82f6',
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  robotEmoji: {
    fontSize: 32,
  },
  meditationBase: {
    width: 96,
    height: 48,
    backgroundColor: '#e5e7eb',
    borderRadius: 24,
    opacity: 0.6,
  },
  getStartedButton: {
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 25,
    paddingVertical: 16,
  },
  getStartedButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
});
