import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG, CHAT_CONFIG, TTS_CONFIG, VOICE_CONFIG } from '../config/chatConfig';
import BottomNavigation from '../components/BottomNavigation';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I\'m ORION, your AI assistant. How can I help you today?',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  
  const scrollViewRef = useRef();
  const model = genAI.getGenerativeModel({ 
    model: GEMINI_CONFIG.model,
    generationConfig: GEMINI_CONFIG.generationConfig,
    safetySettings: GEMINI_CONFIG.safetySettings,
  });

  useEffect(() => {
    // Request audio permissions on component mount
    requestAudioPermissions();
    
    // Set up audio mode for better speech recognition
    Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    return () => {
      // Cleanup
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, []);

  const requestAudioPermissions = async () => {
    try {
      console.log('🎤 Requesting audio permissions...');
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('❌ Audio permission denied');
        Alert.alert(
          'Permission Required',
          'Audio recording permission is required for voice input.',
          [{ text: 'OK' }]
        );
      } else {
        console.log('✅ Audio permission granted');
      }
    } catch (error) {
      console.error('❌ Error requesting audio permissions:', error);
      Alert.alert(
        'Permission Error',
        'Failed to request audio permissions. Voice features may not work.',
        [{ text: 'OK' }]
      );
    }
  };

  const generateResponse = async (userMessage) => {
    try {
      setIsLoading(true);
      
      // Create a context-aware prompt
      const prompt = `You are ORION, an AI assistant for a robot companion app. 
      You should be helpful, friendly, and knowledgeable about robotics, technology, and general topics.
      Keep responses concise but informative. User message: "${userMessage}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const botMessage = response.text();

      // Add bot message to chat
      const newMessage = {
        id: Date.now().toString(),
        text: botMessage,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, newMessage]);

      // Speak the response if TTS is enabled
      if (ttsEnabled) {
        speakText(botMessage);
      }

    } catch (error) {
      console.error('Error generating AI response:', error);
      
      // Add error message
      const errorMessage = {
        id: Date.now().toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputText.trim();
    setInputText('');

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Generate AI response
    await generateResponse(messageToSend);
  };

  const speakText = async (text) => {
    try {
      setIsSpeaking(true);
      
      // Stop any ongoing speech first
      await Speech.stop();
      
      await Speech.speak(text, {
        language: TTS_CONFIG.language,
        pitch: TTS_CONFIG.pitch,
        rate: TTS_CONFIG.rate,
        quality: TTS_CONFIG.quality,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = async () => {
    try {
      await Speech.stop();
      setIsSpeaking(false);
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant audio recording permission.');
        return;
      }

      setIsRecording(true);
      
      const recordingOptions = {
        android: {
          extension: VOICE_CONFIG.android.extension,
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: VOICE_CONFIG.android.sampleRate,
          numberOfChannels: VOICE_CONFIG.android.numberOfChannels,
          bitRate: VOICE_CONFIG.android.bitRate,
        },
        ios: {
          extension: VOICE_CONFIG.ios.extension,
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: VOICE_CONFIG.ios.sampleRate,
          numberOfChannels: VOICE_CONFIG.ios.numberOfChannels,
          bitRate: VOICE_CONFIG.ios.bitRate,
          linearPCMBitDepth: VOICE_CONFIG.ios.linearPCMBitDepth,
          linearPCMIsBigEndian: VOICE_CONFIG.ios.linearPCMIsBigEndian,
          linearPCMIsFloat: VOICE_CONFIG.ios.linearPCMIsFloat,
        },
      };

      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(recordingOptions);
      await newRecording.startAsync();
      setRecording(newRecording);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      Alert.alert('Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      
      // For now, just show a placeholder message since speech-to-text requires additional setup
      Alert.alert(
        'Voice Recording',
        'Voice input recorded! For now, please type your message. Speech-to-text conversion will be implemented in a future update.',
        [{ text: 'OK' }]
      );
      
      setRecording(null);
    } catch (error) {
      console.error('Error stopping recording:', error);
      Alert.alert('Error', 'Failed to process voice input.');
    }
  };

  const toggleTTS = () => {
    setTtsEnabled(!ttsEnabled);
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat',
      'Are you sure you want to clear all messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setMessages([
              {
                id: '1',
                text: 'Hello! I\'m ORION, your AI assistant. How can I help you today?',
                isBot: true,
                timestamp: new Date(),
              },
            ]);
          },
        },
      ]
    );
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const renderMessage = (message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isBot ? styles.botMessage : styles.userMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isBot ? styles.botBubble : styles.userBubble,
        ]}
      >
        <Text style={[
          styles.messageText,
          message.isBot ? styles.botText : styles.userText,
        ]}>
          {message.text}
        </Text>
        <Text style={[
          styles.timestamp,
          message.isBot ? styles.botTimestamp : styles.userTimestamp,
        ]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
      {message.isBot && (
        <TouchableOpacity
          style={styles.speakButton}
          onPress={() => speakText(message.text)}
          disabled={isSpeaking}
        >
          <Ionicons
            name={isSpeaking ? "volume-high" : "volume-medium"}
            size={16}
            color="#666"
          />
        </TouchableOpacity>
      )}
    </View>
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
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>ORION AI Chat</Text>
          <Text style={styles.headerSubtitle}>
            {isLoading ? 'Thinking...' : 'Online'}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={toggleTTS}
          >
            <Ionicons
              name={ttsEnabled ? "volume-high" : "volume-mute"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.headerButton}
            onPress={clearChat}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(renderMessage)}
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.loadingText}>ORION is thinking...</Text>
            </View>
          )}
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#999"
              multiline
              maxLength={1000}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
            />
            
            <TouchableOpacity
              style={styles.voiceButton}
              onPress={isRecording ? stopRecording : startRecording}
              disabled={isLoading}
            >
              <Ionicons
                name={isRecording ? "stop" : "mic"}
                size={20}
                color={isRecording ? "#ff4444" : "#007AFF"}
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Ionicons
                name="send"
                size={20}
                color={(!inputText.trim() || isLoading) ? "#ccc" : "#fff"}
              />
            </TouchableOpacity>
          </View>
          
          {isSpeaking && (
            <TouchableOpacity style={styles.stopSpeakingButton} onPress={stopSpeaking}>
              <Ionicons name="stop-circle" size={16} color="#ff4444" />
              <Text style={styles.stopSpeakingText}>Stop Speaking</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentScreen="Chat" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingBottom: 100, // Add padding to account for bottom navigation
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#ccc',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  messageContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    marginRight: 40,
  },
  userBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
    marginLeft: 40,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  botText: {
    color: '#000',
  },
  userText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  botTimestamp: {
    color: '#666',
  },
  userTimestamp: {
    color: '#ccc',
  },
  speakButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  inputContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    backgroundColor: '#ffffff',
    color: '#000000',
    minHeight: 44,
  },
  voiceButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  stopSpeakingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 8,
  },
  stopSpeakingText: {
    marginLeft: 4,
    color: '#ff4444',
    fontSize: 14,
  },
});
