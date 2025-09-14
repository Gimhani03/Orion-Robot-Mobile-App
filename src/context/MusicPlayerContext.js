import React, { createContext, useContext, useRef, useState } from 'react';
import { Audio } from 'expo-av';

const MusicPlayerContext = createContext();

export function useMusicPlayer() {
  return useContext(MusicPlayerContext);
}

export function MusicPlayerProvider({ children }) {
  const soundRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackStatus, setPlaybackStatus] = useState(null);
  const [playerVisible, setPlayerVisible] = useState(false);

  const playTrack = async (track) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.audio },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      soundRef.current = newSound;
      setCurrentTrack(track);
      setIsPlaying(true);
      setPlayerVisible(true);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error playing track:', error);
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
    if (status.didJustFinish) {
      setIsPlaying(false);
      // Optionally: auto-play next track
    }
  };

  const stopPlayer = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsPlaying(false);
    setPlayerVisible(false);
    setCurrentTrack(null);
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        playbackStatus,
        playerVisible,
        playTrack,
        togglePlayPause,
        stopPlayer,
        setPlayerVisible,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}
