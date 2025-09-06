import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import jamendoAPI from '../services/jamendoAPI';
import { MUSIC_GENRES, PLAYER_CONFIG } from '../config/musicConfig';
import BottomNavigation from '../components/BottomNavigation';

const { width, height } = Dimensions.get('window');

export default function MusicScreen({ navigation }) {
  // State management
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('pop');
  const [sound, setSound] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState(null);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Refs
  const soundRef = useRef(null);

  useEffect(() => {
    // Load initial tracks
    loadTracks();
    
    // Cleanup audio on unmount
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const loadTracks = async (genre = selectedGenre) => {
    setIsLoading(true);
    try {
      const trackData = await jamendoAPI.getTracksByGenre(genre, { limit: 20 });
      const formattedTracks = jamendoAPI.formatTracks(trackData);
      setTracks(formattedTracks);
    } catch (error) {
      console.error('Error loading tracks:', error);
      Alert.alert('Error', 'Failed to load music. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const searchTracks = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const trackData = await jamendoAPI.searchTracks(searchQuery, { limit: 20 });
      const formattedTracks = jamendoAPI.formatTracks(trackData);
      setTracks(formattedTracks);
    } catch (error) {
      console.error('Error searching tracks:', error);
      Alert.alert('Error', 'Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const playTrack = async (track) => {
    try {
      // Stop current track if playing
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      // Load and play new track
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.audio },
        PLAYER_CONFIG,
        onPlaybackStatusUpdate
      );

      soundRef.current = newSound;
      setSound(newSound);
      setCurrentTrack(track);
      setIsPlaying(true);
      setPlayerVisible(true);
      
      await newSound.playAsync();
      console.log('🎵 Now playing:', track.name);
    } catch (error) {
      console.error('Error playing track:', error);
      Alert.alert('Playback Error', 'Failed to play this track. Please try another.');
    }
  };

  const togglePlayPause = async () => {
    if (!soundRef.current) return;

    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await soundRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    setPlaybackStatus(status);
    if (status.isLoaded) {
      setCurrentTime(status.positionMillis || 0);
      setDuration(status.durationMillis || 0);
      
      if (status.didJustFinish) {
        setIsPlaying(false);
        // Auto-play next track or loop
      }
    }
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const renderTrackItem = (track, index) => (
    <TouchableOpacity
      key={track.id}
      style={styles.trackItem}
      onPress={() => playTrack(track)}
    >
      <Image source={{ uri: track.image }} style={styles.trackImage} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackName} numberOfLines={1}>
          {track.name}
        </Text>
        <Text style={styles.artistName} numberOfLines={1}>
          {track.artist}
        </Text>
        <Text style={styles.duration}>
          {formatTime(track.duration * 1000)}
        </Text>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={() => playTrack(track)}>
        <Ionicons
          name={currentTrack?.id === track.id && isPlaying ? "pause" : "play"}
          size={20}
          color="#007AFF"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderGenreChip = (genre) => (
    <TouchableOpacity
      key={genre.id}
      style={[
        styles.genreChip,
        { backgroundColor: selectedGenre === genre.id ? genre.color : '#f0f0f0' }
      ]}
      onPress={() => {
        setSelectedGenre(genre.id);
        loadTracks(genre.id);
      }}
    >
      <Text style={[
        styles.genreText,
        { color: selectedGenre === genre.id ? '#fff' : '#000' }
      ]}>
        {genre.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ORION Music</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs, artists..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchTracks}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Genre Selection */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.genreContainer}
        contentContainerStyle={styles.genreContent}
      >
        {MUSIC_GENRES.map(renderGenreChip)}
      </ScrollView>

      {/* Track List */}
      <ScrollView style={styles.trackList} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading music...</Text>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>
              {searchQuery ? `Search Results` : `${selectedGenre.charAt(0).toUpperCase() + selectedGenre.slice(1)} Music`}
            </Text>
            {tracks.map(renderTrackItem)}
          </>
        )}
      </ScrollView>

      {/* Mini Player */}
      {currentTrack && (
        <TouchableOpacity 
          style={styles.miniPlayer}
          onPress={() => setPlayerVisible(true)}
        >
          <Image source={{ uri: currentTrack.image }} style={styles.miniPlayerImage} />
          <View style={styles.miniPlayerInfo}>
            <Text style={styles.miniPlayerTrack} numberOfLines={1}>
              {currentTrack.name}
            </Text>
            <Text style={styles.miniPlayerArtist} numberOfLines={1}>
              {currentTrack.artist}
            </Text>
          </View>
          <TouchableOpacity onPress={togglePlayPause} style={styles.miniPlayerButton}>
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={24}
              color="#007AFF"
            />
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Full Screen Player Modal */}
      <Modal
        visible={playerVisible}
        animationType="slide"
        onRequestClose={() => setPlayerVisible(false)}
      >
        <View style={styles.playerModal}>
          <View style={styles.playerHeader}>
            <TouchableOpacity onPress={() => setPlayerVisible(false)}>
              <Ionicons name="chevron-down" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.playerHeaderText}>Now Playing</Text>
            <TouchableOpacity>
              <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {currentTrack && (
            <>
              <Image source={{ uri: currentTrack.image }} style={styles.playerImage} />
              
              <View style={styles.playerInfo}>
                <Text style={styles.playerTrackName}>{currentTrack.name}</Text>
                <Text style={styles.playerArtistName}>{currentTrack.artist}</Text>
              </View>

              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }
                    ]} 
                  />
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                  <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>
              </View>

              <View style={styles.playerControls}>
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="play-skip-back" size={32} color="#333" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.playPauseButton} onPress={togglePlayPause}>
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={40}
                    color="#fff"
                  />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.controlButton}>
                  <Ionicons name="play-skip-forward" size={32} color="#333" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentScreen="Music" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#000',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#000',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  genreContainer: {
    backgroundColor: '#000',
    paddingBottom: 10,
  },
  genreContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  genreChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  genreText: {
    fontSize: 14,
    fontWeight: '600',
  },
  trackList: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  trackInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trackName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  duration: {
    fontSize: 12,
    color: '#999',
  },
  playButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  miniPlayerImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  miniPlayerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  miniPlayerTrack: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  miniPlayerArtist: {
    fontSize: 12,
    color: '#666',
  },
  miniPlayerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerModal: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  playerHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  playerImage: {
    width: width * 0.8,
    height: width * 0.8,
    alignSelf: 'center',
    borderRadius: 12,
    marginVertical: 30,
  },
  playerInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  playerTrackName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  playerArtistName: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseButton: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 40,
  },
});
