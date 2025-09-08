import { JAMENDO_CONFIG, FEATURED_TRACKS } from '../config/musicConfig';

class JamendoAPI {
  constructor() {
    this.baseUrl = JAMENDO_CONFIG.baseUrl;
    this.apiKey = JAMENDO_CONFIG.apiKey;
  }

  // Build API URL with common parameters
  buildUrl(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    url.searchParams.append('client_id', this.apiKey);
    url.searchParams.append('format', JAMENDO_CONFIG.format);
    
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
    
    return url.toString();
  }

  // Generic API request method
  async makeRequest(endpoint, params = {}) {
    try {
      const url = this.buildUrl(endpoint, params);
      console.log('🎵 Jamendo API Request:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🎵 Jamendo API Response:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Jamendo API Error:', error);
      throw error;
    }
  }

  // Search for tracks
  async searchTracks(query, options = {}) {
    try {
      const params = {
        search: query,
        limit: options.limit || JAMENDO_CONFIG.limit,
        include: 'musicinfo',
        groupby: 'artist_id',
        ...options
      };

      const data = await this.makeRequest('tracks', params);
      return data.results || [];
    } catch (error) {
      console.error('Error searching tracks:', error);
      return FEATURED_TRACKS; // Return fallback tracks
    }
  }

  // Get tracks by genre
  async getTracksByGenre(genre, options = {}) {
    try {
      const params = {
        tags: genre,
        limit: options.limit || JAMENDO_CONFIG.limit,
        include: 'musicinfo',
        groupby: 'artist_id',
        ...options
      };

      const data = await this.makeRequest('tracks', params);
      return data.results || [];
    } catch (error) {
      console.error('Error getting tracks by genre:', error);
      return FEATURED_TRACKS;
    }
  }

  // Get popular tracks
  async getPopularTracks(options = {}) {
    try {
      const params = {
        order: 'popularity_total',
        limit: options.limit || JAMENDO_CONFIG.limit,
        include: 'musicinfo',
        groupby: 'artist_id',
        ...options
      };

      const data = await this.makeRequest('tracks', params);
      return data.results || [];
    } catch (error) {
      console.error('Error getting popular tracks:', error);
      return FEATURED_TRACKS;
    }
  }

  // Get latest tracks
  async getLatestTracks(options = {}) {
    try {
      const params = {
        order: 'releasedate_desc',
        limit: options.limit || JAMENDO_CONFIG.limit,
        include: 'musicinfo',
        groupby: 'artist_id',
        ...options
      };

      const data = await this.makeRequest('tracks', params);
      return data.results || [];
    } catch (error) {
      console.error('Error getting latest tracks:', error);
      return FEATURED_TRACKS;
    }
  }

  // Get albums
  async getAlbums(options = {}) {
    try {
      const params = {
        limit: options.limit || JAMENDO_CONFIG.limit,
        include: 'musicinfo',
        ...options
      };

      const data = await this.makeRequest('albums', params);
      return data.results || [];
    } catch (error) {
      console.error('Error getting albums:', error);
      return [];
    }
  }

  // Get artists
  async getArtists(options = {}) {
    try {
      const params = {
        limit: options.limit || JAMENDO_CONFIG.limit,
        ...options
      };

      const data = await this.makeRequest('artists', params);
      return data.results || [];
    } catch (error) {
      console.error('Error getting artists:', error);
      return [];
    }
  }

  // Get track details
  async getTrackDetails(trackId) {
    try {
      const params = {
        id: trackId,
        include: 'musicinfo+lyrics'
      };

      const data = await this.makeRequest('tracks', params);
      return data.results?.[0] || null;
    } catch (error) {
      console.error('Error getting track details:', error);
      return null;
    }
  }

  // Get playlists
  async getPlaylists(options = {}) {
    try {
      const params = {
        limit: options.limit || JAMENDO_CONFIG.limit,
        ...options
      };

      const data = await this.makeRequest('playlists', params);
      return data.results || [];
    } catch (error) {
      console.error('Error getting playlists:', error);
      return [];
    }
  }

  // Format track data for consistent use
  formatTrack(track) {
    return {
      id: track.id,
      name: track.name,
      artist: track.artist_name || 'Unknown Artist',
      duration: track.duration || 0,
      audio: track.audio || '',
      audioHQ: track.audiodownload_allowed ? track.audiodownload : track.audio,
      image: track.image || track.album_image || 'https://via.placeholder.com/300x300/007AFF/ffffff?text=♪',
      album: track.album_name || '',
      genre: track.musicinfo?.tags?.genres?.join(', ') || 'Unknown',
      releaseDate: track.releasedate || '',
      license: track.license_ccurl || '',
    };
  }

  // Format multiple tracks
  formatTracks(tracks) {
    return tracks.map(track => this.formatTrack(track));
  }
}

// Create and export a singleton instance
const jamendoAPI = new JamendoAPI();
export default jamendoAPI;
