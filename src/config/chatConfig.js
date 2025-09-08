// Gemini AI Configuration
// Replace 'YOUR_GEMINI_API_KEY_HERE' with your actual API key from Google AI Studio

export const GEMINI_CONFIG = {
  apiKey: 'AIzaSyBsQk4tc771sSU-E9p9NlQaC_n8r5SlLGQ', // 👈 PASTE YOUR API KEY HERE
  model: 'gemini-1.5-flash',
  generationConfig: {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  },
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
};

// Chat Configuration
export const CHAT_CONFIG = {
  maxMessages: 50, // Maximum number of messages to keep in chat history
  maxMessageLength: 1000, // Maximum characters per message
  typingIndicatorDelay: 1000, // Delay before showing typing indicator
  autoScrollDelay: 100, // Delay before auto-scrolling to new message
};

// Text-to-Speech Configuration
export const TTS_CONFIG = {
  language: 'en-US',
  pitch: 1.0,
  rate: 0.8,
  quality: 'enhanced',
};

// Voice Recording Configuration
export const VOICE_CONFIG = {
  android: {
    extension: '.m4a',
    outputFormat: 'MPEG_4',
    audioEncoder: 'AAC',
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.wav',
    audioQuality: 'HIGH',
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};
