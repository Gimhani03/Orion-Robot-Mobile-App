import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMusicPlayer } from '../context/MusicPlayerContext';

export default function FullMusicPlayerScreen({ visible, onClose }) {
  const { currentTrack, isPlaying, togglePlayPause, playbackStatus } = useMusicPlayer();

  if (!visible || !currentTrack) return null;

  const artist = currentTrack.artist || currentTrack.artist_name || 'Unknown Artist';
  // Progress bar calculation
  const duration = playbackStatus?.durationMillis || currentTrack.duration * 1000 || 1;
  const position = playbackStatus?.positionMillis || 0;
  const progress = Math.min(position / duration, 1);

  // Format time helper
  const formatTime = ms => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Image source={{ uri: currentTrack.image }} style={styles.albumArt} />
          <Text style={styles.trackTitle} numberOfLines={2}>{currentTrack.name}</Text>
          <Text style={styles.artistName} numberOfLines={1}>{artist}</Text>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
            </View>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
          <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={48} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
    gap: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  progressBarFill: {
    height: 6,
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
  timeText: {
    color: '#aaa',
    fontSize: 13,
    minWidth: 36,
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#111',
    borderRadius: 24,
    alignItems: 'center',
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  albumArt: {
    width: 220,
    height: 220,
    borderRadius: 16,
    marginBottom: 32,
    backgroundColor: '#222',
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  artistName: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 32,
  },
  playButton: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 16,
    marginTop: 16,
  },
});
