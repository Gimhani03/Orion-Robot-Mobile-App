import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import FullMusicPlayerScreen from '../screens/FullMusicPlayerScreen';

export default function MiniMusicPlayer({ onOpenPlayer }) {
  const { currentTrack, isPlaying, togglePlayPause, setPlayerVisible } = useMusicPlayer();
  // Use local state to control full screen player
  const [fullPlayerVisible, setFullPlayerVisible] = React.useState(false);
  const handleOpenFullPlayer = () => {
    setFullPlayerVisible(true);
  };
  const handleCloseFullPlayer = () => {
    setFullPlayerVisible(false);
  };

  if (!currentTrack) {
    console.log('[MiniMusicPlayer] Not visible: No currentTrack');
    return null;
  }
  console.log('[MiniMusicPlayer] Visible: Track =', currentTrack.name);

  const artist = currentTrack.artist || currentTrack.artist_name || 'Unknown Artist';
  return (
    <>
      <TouchableOpacity style={[styles.miniPlayer, { zIndex: 9999, elevation: 10 }]} onPress={handleOpenFullPlayer}>
        <Image source={{ uri: currentTrack.image }} style={styles.miniPlayerImage} />
        <View style={styles.miniPlayerInfo}>
          <Text style={styles.miniPlayerTrack} numberOfLines={1}>{currentTrack.name}</Text>
          <Text style={styles.miniPlayerArtist} numberOfLines={1}>{artist}</Text>
        </View>
        <TouchableOpacity onPress={togglePlayPause} style={styles.miniPlayerButton}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#007AFF" />
        </TouchableOpacity>
      </TouchableOpacity>
      {/* Full screen player modal */}
      <FullMusicPlayerScreen visible={fullPlayerVisible} onClose={handleCloseFullPlayer} />
    </>
  );
}

const styles = StyleSheet.create({
  miniPlayer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 80,
    backgroundColor: '#fff',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 100,
  },
  miniPlayerImage: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 12,
  },
  miniPlayerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  miniPlayerTrack: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  miniPlayerArtist: {
    fontSize: 14,
    color: '#666',
  },
  miniPlayerButton: {
    marginLeft: 12,
    padding: 8,
  },
});
