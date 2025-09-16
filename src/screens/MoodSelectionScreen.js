import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const MOODS = [
  { key: 'happy', label: 'Happy', color: '#FFD700', icon: 'happy-outline' },
  { key: 'sad', label: 'Sad', color: '#4f8ef7', icon: 'sad-outline' },
  { key: 'stressed', label: 'Stressed', color: '#e74c3c', icon: 'alert-circle-outline' },
  { key: 'relaxed', label: 'Relaxed', color: '#2ecc71', icon: 'leaf-outline' },
];

const MUSIC_RECOMMENDATIONS = {
  happy: ['Upbeat Pop', 'Dance Hits', 'Feel Good Indie'],
  sad: ['Chill Acoustic', 'Soft Piano', 'Emotional Ballads'],
  stressed: ['Relaxing Instrumentals', 'Nature Sounds', 'Calm Lo-Fi'],
  relaxed: ['Ambient', 'Jazz', 'Chillhop'],
};

export default function MoodSelectionScreen({ navigation }) {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleMoodSelect = async (moodKey) => {
    setSelectedMood(moodKey);
    setRecommendations(MUSIC_RECOMMENDATIONS[moodKey] || []);
    if (!user || !(user.id || user._id)) return;
    setSaving(true);
    try {
      await fetch('http://192.168.1.3:5000/api/moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user.id || user._id, mood: moodKey }),
      });
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <View style={styles.moodRow}>
        {MOODS.map(mood => (
          <TouchableOpacity
            key={mood.key}
            style={[styles.moodCard, selectedMood === mood.key && { borderColor: mood.color, borderWidth: 2 }]}
            onPress={() => handleMoodSelect(mood.key)}
            disabled={saving}
          >
            <Ionicons name={mood.icon} size={40} color={mood.color} />
            <Text style={[styles.moodLabel, { color: mood.color }]}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedMood && (
        <View style={styles.recommendBox}>
          <Text style={styles.recommendTitle}>Recommended Music for {MOODS.find(m => m.key === selectedMood)?.label}:</Text>
          {recommendations.map((rec, idx) => (
            <Text key={idx} style={styles.recommendItem}>• {rec}</Text>
          ))}
        </View>
      )}
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => navigation.navigate('ChooseTopic')}
        disabled={!selectedMood}
      >
        <Text style={styles.doneButtonText}>{saving ? 'Saving...' : 'Done'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 24,
    textAlign: 'center',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  moodCard: {
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 16,
    width: 90,
  },
  moodLabel: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 13,
  },
  recommendBox: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  recommendTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  recommendItem: {
    color: '#4f8ef7',
    fontSize: 15,
    marginBottom: 4,
  },
  doneButton: {
    backgroundColor: '#111',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
