# ORION Robot Mobile App 🤖

A comprehensive React Native mobile application built with Expo, featuring modern UI/UX design, user authentication, profile management, AI chatbot, music streaming, and interactive robot-themed features. Perfect for STEM education and robot enthusiasts.

## ✨ Features

### 🔐 Authentication & Onboarding

- **Splash Screen**: Animated welcome screen with ORION branding
- **Authentication Flow**: Complete sign in and sign up screens with social login options
- **Home Dashboard**: Welcome screen with illustrated robot graphics
- **Backend Integration**: Full authentication with JWT tokens and MongoDB

### 👤 Profile Management

- **Complete Profile System**: Full user profile with image upload functionality
- **Image Picker**: Camera and gallery integration with cropping capabilities
- **Profile Picture Display**: Dynamic profile images shown across the app
- **Data Validation**: Email validation and required field checking
- **Real-time Updates**: Instant profile updates with global state management
- **Permanent Storage**: Profile images saved using expo-file-system

### 🤖 AI Chatbot & Voice Features

- **Google Gemini AI Integration**: Advanced conversational AI powered by Gemini 1.5 Flash
- **Text-to-Speech**: AI responses read aloud using expo-speech
- **Voice Recording**: Record voice messages for AI interaction
- **Chat History**: Persistent conversation storage in MongoDB
- **Modern Audio API**: Updated from deprecated expo-permissions to Audio API
- **Real-time Responses**: Streaming AI responses with loading indicators

### 🎵 Music Streaming & Mood-Based Recommendations

- **Jamendo API Integration**: Access to thousands of royalty-free tracks
- **Mood-Based Music Recommendations**: Music suggestions are personalized based on the user's logged mood (happy, sad, stressed, etc.)
- **Stress Relief Music**: If user's mood is "stressed", relaxing genres (chill, ambient, relax, calm, meditation) are recommended
- **Uplifting Music for Sad Mood**: If user's mood is "sad", uplifting and comforting genres (uplifting, happy, hope, comfort, acoustic, positive, inspirational, chill) are recommended
- **Mood Display**: User's current mood is shown at the top of the Music screen
- **Advanced Search**: Search for songs and artists
- **Full Music Player**: Play/pause, progress tracking, time display
- **Mini Player**: Persistent player while browsing
- **Full-Screen Player**: Complete interface with album art and controls
- **Background Playback**: Music continues while navigating
- **Genre Chips Removed**: Genre selection chips (Jazz, Pop, Rock, etc.) have been removed for a cleaner UI

### 🎯 Interactive Features

- **Topic Selection Hub**: Interactive grid of robot-themed features
- **About Section**: Learn about robots and STEM education with 8 robot characters
- **Smart Reminders**: Advanced time picker with AM/PM selection
- **Review System**: Complete CRUD operations for user reviews and ratings
- **Shopping Assistant**: E-commerce integration (coming soon)
- **Bottom Navigation**: Seamless navigation between core features

### 🎨 Modern UI/UX

- **Responsive Design**: Optimized for all screen sizes
- **Dark/Light Themes**: Consistent color scheme with black headers and white content
- **Smooth Animations**: Fluid navigation and interactions
- **Touch-Friendly**: Large buttons and intuitive gestures
- **NativeWind**: Tailwind CSS integration for React Native

## 🛠 Tech Stack
## 📁 Project Structure

```
orion/
├── App.js
├── README.md
├── package.json
├── app.json
├── babel.config.js
├── metro.config.js
├── assets/
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── homelogo.png
│   ├── icon.png
│   ├── logo.png
│   ├── robots.jpg
│   └── robots/
│       ├── jupe.jpg
│       ├── loona.jpg
│       ├── marz.jpg
│       ├── nep.jpg
│       ├── obayy.jpg
│       ├── satu.jpg
│       ├── uro.jpg
│       └── vee.jpg
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── mood.js
│   │   ├── music.js
│   │   ├── profile.js
│   │   ├── reminder.js
│   │   ├── review.js
│   │   ├── todo.js
│   │   └── user.js
│   ├── models/
│   │   ├── MoodLog.js
│   │   ├── Reminder.js
│   │   ├── Review.js
│   │   ├── Todo.js
│   │   └── User.js
│   ├── services/
│   │   ├── jamendoAPI.js
│   │   └── ...
│   ├── utils/
│   │   ├── cloudinary.js
│   │   ├── email.js
│   │   └── todoAPI.js
│   └── ...
├── src/
│   ├── api/
│   │   ├── chatAPI.js
│   │   ├── todoAPI.js
│   │   └── ...
│   ├── components/
│   │   ├── BottomNavigation.js
│   │   ├── Button.js
│   │   ├── ConnectionTest.js
│   │   ├── MiniMusicPlayer.js
│   │   ├── SignupTest.js
│   │   └── ...
│   ├── config/
│   │   ├── api.js
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.js
│   │   ├── MusicPlayerContext.js
│   │   └── ...
│   ├── screens/
│   │   ├── MusicScreen.js
│   │   ├── ChooseTopicScreen.js
│   │   ├── MoodSelectionScreen.js
│   │   ├── AboutScreen.js
│   │   ├── HomeScreen.js
│   │   ├── SignInScreen.js
│   │   ├── SignUpScreen.js
│   │   └── ...
│   ├── services/
│   │   ├── jamendoAPI.js
│   │   └── ...
│   ├── styles.js
│   └── ...
└── ...
```

### Frontend

- **React Native** - Cross-platform mobile development
- **Expo SDK 53** - Development platform and native APIs
- **React Navigation v6** - Stack-based navigation system
- **React Context API** - Global state management
- **AsyncStorage** - Persistent local storage for user/session data
- **Expo Vector Icons** - Comprehensive icon library
- **Expo Image Picker** - Camera and gallery integration
- **Expo Audio** - Modern audio playback and recording
- **Expo Speech** - Text-to-speech functionality
- **Expo File System** - Permanent file storage
- **NativeWind** - Tailwind CSS for React Native
- **StyleSheet API** - Native styling solution
- **JavaScript ES6+** - Modern JavaScript features

### Backend

- **Node.js & Express.js** - REST API server
- **MongoDB & Mongoose** - NoSQL database and ODM
- **JWT Authentication** - Secure token-based auth
- **BcryptJS** - Password hashing and security
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management
- **Express Rate Limit** - API rate limiting for security
- **Nodemailer** - Email sending for notifications and verification
- **Cloudinary** - Image upload and management

### AI & External APIs

- **Google Gemini AI** - Advanced conversational AI (Gemini 1.5 Flash)
- **Jamendo API** - Royalty-free music streaming
- **Audio/Speech APIs** - Voice recording and text-to-speech
- **Cloudinary API** - Image hosting and transformation

## 📱 Screens Overview

| Screen                | Description         | Features                                |
| --------------------- | ------------------- | --------------------------------------- |
| **SplashScreen**      | App entry point     | Branding, navigation to auth            |
| **SignInScreen**      | User authentication | Email/password login, social auth       |
| **SignUpScreen**      | User registration   | Form validation, privacy policy         |
| **HomeScreen**        | Main dashboard      | Welcome message, navigation hub         |
| **ChooseTopicScreen** | Feature selection   | 6 interactive topic cards with icons    |
| **AboutScreen**       | Robot information   | 8 robot characters, STEM education      |
| **ReminderScreen**    | Task management     | Advanced time picker, reminder setting  |
| **ReviewsScreen**     | Review system       | Add, edit, delete, rate (1-5 stars)     |
| **ProfileScreen**     | User management     | Profile editing, image upload, settings |
| **ChatScreen**        | AI Chatbot          | Gemini AI, voice recording, TTS         |
| **MoodSelectionScreen** | Mood selection      | Choose and log mood, triggers mood-based music recommendations |
| **MusicScreen**       | Music player        | Jamendo streaming, mood-based recommendations, mood display, stress/sad relief music, genre chips removed |

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later) - [Download here](https://nodejs.org/)
- **Expo CLI** - Install globally: `npm install -g @expo/cli`
- **Mobile device** with Expo Go app OR **Android/iOS emulator**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Gimhani03/Orion-Robot-Mobile-App.git
   cd orion
   ```

2. **Install dependencies:**

   ```bash
   npm install
   cd backend && npm install && cd ..
   ```

3. **Set up environment variables:**

   Create `.env` file in the backend directory:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

   Update API keys in configuration files:

   ```javascript
   // src/config/chatConfig.js
   export const GEMINI_CONFIG = {
     apiKey: "YOUR_GEMINI_API_KEY", // Get from Google AI Studio
     // ...
   };

   // src/config/musicConfig.js
   export const JAMENDO_CONFIG = {
     apiKey: "YOUR_JAMENDO_CLIENT_ID", // Get from Jamendo Developer Portal
     // ...
   };
   ```

4. **Start the backend server:**

   ```bash
   cd backend && npm run dev
   ```

5. **Start the Expo development server:**

   ```bash
   npx expo start
   ```

6. **Run on your preferred platform:**
   ```bash
   npx expo start --android  # For Android
   npx expo start --ios      # For iOS
   npx expo start --web      # For web browser
   ```

### 🔑 API Keys Setup

#### Google Gemini AI (Free)

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new project and get your API key
3. Add to `src/config/chatConfig.js`

#### Jamendo Music API (Free)

1. Go to [Jamendo Developer Portal](https://developer.jamendo.com/v3.0)
2. Sign up and create a new application
3. Copy your Client ID to `src/config/musicConfig.js`

### 📱 Testing on Device

1. Install **Expo Go** from App Store/Google Play
2. Scan the QR code from the terminal/browser
3. The app will load on your device

## 📁 Project Structure

```
orion/
├── src/
│   ├── screens/
│   │   ├── SplashScreen.js      # Welcome/landing screen
│   │   ├── SignInScreen.js      # User authentication
│   │   ├── SignUpScreen.js      # User registration
│   │   ├── HomeScreen.js        # Main dashboard
│   │   ├── ChooseTopicScreen.js # Topic selection grid
│   │   ├── AboutScreen.js       # Robot information & education
│   │   ├── ReminderScreen.js    # Time management features
│   │   ├── ReviewsScreen.js     # Review and rating system
│   │   ├── ProfileScreen.js     # User profile management
│   │   ├── ChatScreen.js        # AI chatbot with voice features
│   │   └── MusicScreen.js       # Music streaming player
│   ├── components/
│   │   └── BottomNavigation.js  # App-wide navigation component
│   ├── context/
│   │   ├── ProfileContext.js    # Profile state management
│   │   └── AuthContext.js       # Authentication state
│   ├── config/
│   │   ├── api.js              # Backend API configuration
│   │   ├── chatConfig.js       # Gemini AI & TTS configuration
│   │   └── musicConfig.js      # Jamendo API configuration
│   ├── services/
│   │   └── jamendoAPI.js       # Jamendo music service
│   └── api/                    # API service layers
├── backend/
│   ├── models/                 # MongoDB data models
│   ├── routes/                 # Express API routes
│   ├── middleware/             # Authentication middleware
│   ├── utils/                  # Utility functions
│   └── server.js              # Main server file
├── assets/
│   ├── robots/                # Robot character images
│   └── [app icons]            # App icons and splash images
├── App.js                     # Main navigation container
├── package.json               # Frontend dependencies
└── README.md                  # Project documentation
```

## 🎨 Design System

### Color Palette

- **Primary**: `#000000` (Black headers and buttons)
- **Background**: `#FFFFFF` (White content areas)
- **Secondary**: `#6B7280` (Gray text and icons)
- **Accent Colors**:
  - Blue: `#60A5FA` (About)
  - Red: `#F87171` (Reminders)
  - Orange: `#FB923C` (Music)
  - Yellow: `#FACC15` (Chatbot)
  - Green: `#4ADE80` (Shop)
  - Purple: `#A78BFA` (Reviews)

### Typography

- **Headers**: Bold, 24px
- **Body Text**: Regular, 16px
- **Captions**: Regular, 14px

### Components

- **Buttons**: Rounded corners, 12px padding
- **Cards**: Rounded 16px, shadow effects
- **Input Fields**: Bordered, rounded 8px
- **Profile Images**: Circular with border

## 🔧 Development Guide

### Adding New Features

1. **Create New Screen:**

   ```javascript
   // src/screens/NewScreen.js
   import React from "react";
   import { View, Text, StyleSheet } from "react-native";

   export default function NewScreen({ navigation }) {
     return (
       <View style={styles.container}>
         <Text>New Feature</Text>
       </View>
     );
   }
   ```

2. **Add to Navigation:**

   ```javascript
   // App.js
   <Stack.Screen name="NewScreen" component={NewScreen} />
   ```

3. **Update Context (if needed):**
   ```javascript
   // src/context/ProfileContext.js
   const [newFeature, setNewFeature] = useState(null);
   ```

### Styling Guidelines

- Use StyleSheet API for consistent styling
- Follow the established color scheme
- Maintain 24px horizontal padding for screens
- Use TouchableOpacity for all interactive elements
- Add proper loading states and error handling

### Testing Checklist

- [ ] Test on both Android and iOS
- [ ] Verify navigation flow
- [ ] Test image picker permissions
- [ ] Validate form inputs
- [ ] Check responsive design
- [ ] Test offline behavior

## 📖 Feature Documentation

### AI Chatbot Features

- **Google Gemini Integration**: Advanced conversational AI with context awareness
- **Text-to-Speech**: AI responses read aloud automatically
- **Chat History**: Persistent conversation storage in MongoDB
- **Modern Audio API**: Replaced deprecated expo-permissions with Audio API
- **Real-time Responses**: Streaming responses with loading indicators

### Music Streaming Features

- **Jamendo Integration**: Access thousands of royalty-free tracks
- **Advanced Search**: Search by song title, artist, or keywords
- **Background Playback**: Music continues while using other features
- **Mini & Full Player**: Compact and expanded player interfaces

### Profile Management

- **Image Upload**: Supports camera and gallery with 1:1 aspect ratio cropping
- **Permanent Storage**: Images saved using expo-file-system (no more cache issues)
- **Data Persistence**: Profile data synced across all screens
- **Validation**: Email format and required field validation
- **Permissions**: Automatic camera and media library permission handling

### Backend Integration

- **RESTful API**: Complete backend with Express.js and MongoDB
- **JWT Authentication**: Secure token-based authentication
- **Chat Storage**: Conversation history stored in database
- **User Management**: Profile data, reviews, and settings persistence
- **Error Handling**: Comprehensive error responses and validation

### Review System

- **CRUD Operations**: Create, read, update, delete reviews
- **Star Ratings**: 1-5 star rating system with visual feedback
- **Data Management**: Local state management with form validation

### Time Management

- **Advanced Picker**: Custom time picker with AM/PM selection
- **User Experience**: Intuitive scroll interface for time selection
- **Validation**: Proper time format handling

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes:** `git commit -m 'Add amazing feature'`
5. **Push to the branch:** `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style and patterns
- Add proper error handling and validation
- Test on multiple devices/screen sizes
- Update documentation for new features
- Include meaningful commit messages

## 🐛 Troubleshooting

### Common Issues

**Backend Connection Issues:**

```bash
# Make sure backend is running on correct port
cd backend && npm run dev
# Check if MongoDB is connected
# Verify environment variables in .env file
```

**Audio Permission Errors:**

```bash
# Update to modern Audio API (already implemented)
npm install expo-audio
# Remove deprecated expo-permissions
npm uninstall expo-permissions
```

**Music Player Not Working:**

```bash
# Verify Jamendo API key in musicConfig.js
# Check network connection
# Clear Expo cache: npx expo start --clear
```

**Gemini AI Errors:**

```bash
# Verify API key in chatConfig.js
# Check model name (should be 'gemini-1.5-flash')
# Ensure network connectivity
```

**Expo Image Picker Not Working:**

```bash
npm install expo-image-picker@~16.1.4
npx expo start --clear
```

**Metro Bundler Issues:**

```bash
npx expo start --clear
# or
rm -rf node_modules && npm install
```

**Permission Errors:**

- Ensure proper permissions in app.json
- Test on physical device for camera/audio access
- Check expo packages version compatibility

### Development Tips

- Always test on physical devices for audio/camera features
- Use `npx expo start --clear` to clear cache when issues occur
- Check console logs for API errors and network issues
- Verify all environment variables are properly set

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **React Native Community** for comprehensive documentation
- **Google AI** for Gemini API and advanced conversational AI
- **Jamendo** for providing royalty-free music streaming API
- **MongoDB** for robust database solutions
- **Vector Icon Libraries** for beautiful iconography
- **STEM Education Community** for inspiration and guidance

---

**Built with ❤️ for robot enthusiasts, STEM learners, and AI innovation**

### 🔗 Links

- **Live Demo**: [Download APK](#) (Coming Soon)
- **API Documentation**: Check backend/README.md
- **Contributing**: See CONTRIBUTING.md
- **Issues**: [GitHub Issues](https://github.com/Gimhani03/Orion-Robot-Mobile-App/issues)

For questions or support, please open an issue or contact the development team.
