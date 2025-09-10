// Jamendo API Configuration
// Get your free API key from: https://developer.jamendo.com/v3.0
// 1. Go to https://developer.jamendo.com/v3.0
// 2. Sign up for a free account
// 3. Create a new application 
// 4. Copy your Client ID and paste it below

export const JAMENDO_CONFIG = {
  apiKey: '', // 👈 Replace with your Jamendo Client ID
  baseUrl: 'https://api.jamendo.com/v3.0',
  format: 'json',
  limit: 20, // Default number of tracks per request
  imageSize: '300', // Album cover size
};

// Default playlists and genres
export const MUSIC_GENRES = [
  { id: 'pop', name: 'Pop', color: '#ff6b6b' },
  { id: 'rock', name: 'Rock', color: '#4ecdc4' },
  { id: 'electronic', name: 'Electronic', color: '#45b7d1' },
  { id: 'jazz', name: 'Jazz', color: '#f9ca24' },
  { id: 'classical', name: 'Classical', color: '#6c5ce7' },
  { id: 'folk', name: 'Folk', color: '#a0e7e5' },
  { id: 'instrumental', name: 'Instrumental', color: '#ffa8a8' },
  { id: 'ambient', name: 'Ambient', color: '#b8e6b8' },
];

// Audio player configuration
export const PLAYER_CONFIG = {
  progressUpdateIntervalMillis: 1000,
  positionMillis: 0,
  shouldPlay: false,
  isLooping: false,
  isMuted: false,
  volume: 1.0,
  rate: 1.0,
  shouldCorrectPitch: true,
};

// Default featured tracks (when API is not available)
export const FEATURED_TRACKS = [
  {
    id: '1',
    name: 'Sample Track 1',
    artist_name: 'Sample Artist',
    duration: 180,
    audio: 'https://example.com/sample1.mp3',
    image: 'https://via.placeholder.com/300x300/ff6b6b/ffffff?text=Music',
  },
  {
    id: '2', 
    name: 'Sample Track 2',
    artist_name: 'Another Artist',
    duration: 240,
    audio: 'https://example.com/sample2.mp3',
    image: 'https://via.placeholder.com/300x300/4ecdc4/ffffff?text=Music',
  },
];

export default {
  JAMENDO_CONFIG,
  MUSIC_GENRES,
  PLAYER_CONFIG,
  FEATURED_TRACKS,
};
