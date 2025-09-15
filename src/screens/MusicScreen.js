import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { MUSIC_GENRES } from '../config/musicConfig';
import jamendoAPI from '../services/jamendoAPI';
import MiniMusicPlayer from '../components/MiniMusicPlayer';
import BottomNavigation from '../components/BottomNavigation';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { useAuth } from '../context/AuthContext';

export default function MusicScreen({ navigation }) {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('pop');
  const [userMood, setUserMood] = useState(null);
  const { playTrack } = useMusicPlayer();
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  console.log('MusicScreen user:', user);
  console.log('MusicScreen userId:', userId);

  useEffect(() => {
    // Fetch latest mood for user
    const fetchMoodAndMusic = async () => {
      if (!userId) {
        console.log('No userId, skipping mood/music fetch');
        return;
      }
      try {
        const res = await fetch(`http://192.168.1.3:5000/api/moods/${userId}/latest`);
        const json = await res.json();
        console.log('Mood API response:', json);
        if (json.success && json.data) {
          setUserMood(json.data.mood);
          setIsLoading(true);
          let moodQuery = json.data.mood;
          let moodTracks = [];
          // Map 'stressed' to relaxing keywords and use search query
          if (moodQuery && moodQuery.toLowerCase() === 'stressed') {
            moodTracks = await jamendoAPI.searchTracks('chill ambient relax calm meditation', { limit: 20 });
          } else if (moodQuery && moodQuery.toLowerCase() === 'sad') {
            moodTracks = await jamendoAPI.searchTracks('uplifting happy hope comfort acoustic positive inspirational chill', { limit: 20 });
          } else {
            moodTracks = await jamendoAPI.getTracksByMood(moodQuery, { limit: 20 });
          }
          console.log('Jamendo moodTracks:', moodTracks);
          setTracks(moodTracks);
        } else {
          console.log('No mood data, loading by genre');
          loadTracks(selectedGenre);
        }
      } catch (err) {
        console.log('Error fetching mood/music:', err);
        loadTracks(selectedGenre);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMoodAndMusic();
  }, []);

  useEffect(() => {
    if (!userMood) {
      loadTracks(selectedGenre);
    }
  }, [selectedGenre]);

  const loadTracks = async (genre) => {
    setIsLoading(true);
    try {
      const trackData = await jamendoAPI.getTracksByGenre(genre, { limit: 20 });
      setTracks(trackData);
    } catch (error) {
      setTracks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchTracks = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const trackData = await jamendoAPI.searchTracks(searchQuery, { limit: 20 });
      setTracks(trackData);
    } catch (error) {
      setTracks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderGenreChip = (genre) => (
    <TouchableOpacity
      key={genre.id}
      style={[styles.genreChip, { backgroundColor: selectedGenre === genre.id ? genre.color : '#f0f0f0' }]}
      onPress={() => setSelectedGenre(genre.id)}
    >
      <Text style={[styles.genreText, { color: selectedGenre === genre.id ? '#fff' : '#000' }]}>{genre.name}</Text>
    </TouchableOpacity>
  );

  const renderTrackItem = (track) => (
    <TouchableOpacity
      key={track.id}
      style={styles.trackItem}
      onPress={() => playTrack(track)}
    >
      <Image source={{ uri: track.image }} style={styles.trackImage} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackName} numberOfLines={1}>{track.name || track.title}</Text>
        <Text style={styles.artistName} numberOfLines={1}>{track.artist || track.artist_name}</Text>
      </View>
      <Ionicons name="play" size={24} color="#007AFF" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ORION Music</Text>
        <View style={{ width: 40 }} />
      </View>
      {/* Show user's mood */}
      {userMood && (
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ color: '#007AFF', fontSize: 16, fontWeight: 'bold' }}>Your Mood: {userMood}</Text>
        </View>
      )}
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search songs, artists..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={searchTracks}
            returnKeyType="search"
            placeholderTextColor="#fff"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>
  {/* Genre Chips removed as requested */}
      {/* Track List */}
      <ScrollView style={styles.trackList} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading music...</Text>
          </View>
        ) : (
          tracks.map(renderTrackItem)
        )}
      </ScrollView>
      {/* Mini Player (only on MusicScreen) */}
      <MiniMusicPlayer />
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
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
  genreScroll: {
    backgroundColor: '#000',
    paddingBottom: 10,
  },
  genreScrollContent: {
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
});

