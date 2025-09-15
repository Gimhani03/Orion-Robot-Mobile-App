import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [checkingMood, setCheckingMood] = useState(true);
  const [showGetStarted, setShowGetStarted] = useState(false);

  useEffect(() => {
    const checkMoodLoggedToday = async () => {
      if (!user || !(user.id || user._id)) {
        setShowGetStarted(true);
        setCheckingMood(false);
        return;
      }
      try {
        const res = await fetch(`http://192.168.1.3:5000/api/moods/${user.id || user._id}/latest`);
        const result = await res.json();
        if (result.success && result.data) {
          const moodDate = new Date(result.data.timestamp);
          const now = new Date();
          if (
            moodDate.getFullYear() === now.getFullYear() &&
            moodDate.getMonth() === now.getMonth() &&
            moodDate.getDate() === now.getDate()
          ) {
            // Mood already logged today, show Get Started button
            setShowGetStarted(true);
            setCheckingMood(false);
            return;
          }
        }
        // Mood not logged today, show mood selection
        navigation.replace('MoodSelection');
      } catch (error) {
        setShowGetStarted(true);
      } finally {
        setCheckingMood(false);
      }
    };
    checkMoodLoggedToday();
  }, [user]);

  if (checkingMood) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4f8ef7" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {/* Header */}
      <Text style={styles.welcomeText}>Welcome to the</Text>
      <Text style={styles.appNameText}>ORION ROBOT APP</Text>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.decorativeElement1} />
        <View style={styles.decorativeElement2} />
        <View style={styles.decorativeElement3} />
        <View style={styles.robotContainer}>
          <Image source={require('../../assets/homelogo.png')} style={{ width: 280, height: 230, borderRadius: 15 }} />
        </View>
      </View>
      {/* Get Started Button */}
      {showGetStarted && (
        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('ChooseTopic')}
        >
          <Text style={styles.getStartedButtonText}>GET STARTED</Text>
        </TouchableOpacity>
      )}
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
