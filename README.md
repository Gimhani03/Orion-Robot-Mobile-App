# ORION Robot Mobile App 🤖

A comprehensive React Native mobile application built with Expo, featuring modern UI/UX design, complete user authentication with password recovery, profile management, AI chatbot, mood-based music streaming, and interactive robot-themed features. Perfect for STEM education and robot enthusiasts.

## ✨ Features

### 🔐 Complete Authentication System

- **Splash Screen**: Animated welcome screen with ORION branding
- **Authentication Flow**: Complete sign in and sign up screens with social login options
- **Forgot Password**: Email-based password recovery with beautiful email templates
- **Reset Password Screen**: Secure password reset with real-time validation and strength indicators
- **Email Integration**: Professional email service with Brevo SMTP and Nodemailer
- **Deep Linking**: Mobile and web URL support for password reset functionality
- **JWT Security**: Token-based authentication with automatic expiration handling
- **Backend Integration**: Full authentication with JWT tokens and MongoDB

### 📧 Advanced Email System

- **Password Reset Emails**: Beautiful HTML email templates with ORION branding
- **Brevo SMTP Integration**: Professional email delivery with high deliverability
- **Email Debugging**: Comprehensive logging and error handling
- **Mobile-Friendly URLs**: Support for both mobile deep links and web URLs
- **Email Validation**: Real-time email format validation
- **Secure Token Management**: 10-minute expiration with crypto-secure tokens

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

### 🎵 Advanced Music Streaming & Mood Integration

- **Jamendo API Integration**: Access to thousands of royalty-free tracks
- **Mood-Based Music Recommendations**: Personalized music based on user's emotional state
- **Intelligent Mood Detection**: Stress relief and uplifting music suggestions
- **Stress Relief Music**: Chill, ambient, relax, calm, meditation genres for stressed users
- **Uplifting Music for Sadness**: Happy, hopeful, inspirational tracks for sad moods
- **Current Mood Display**: Real-time mood indicator in music interface
- **Advanced Search**: Search for songs and artists with intelligent filtering
- **Full Music Player**: Complete playback controls with progress tracking
- **Mini Player**: Persistent player widget while browsing other features
- **Full-Screen Player**: Immersive interface with album art and advanced controls
- **Background Playback**: Uninterrupted music while navigating the app
- **Clean UI Design**: Removed genre chips for streamlined user experience
- **Mood Display**: User's current mood is shown at the top of the Music screen
- **Advanced Search**: Search for songs and artists
- **Full Music Player**: Play/pause, progress tracking, time display
- **Mini Player**: Persistent player while browsing
- **Full-Screen Player**: Complete interface with album art and controls
- **Background Playback**: Music continues while navigating

### 🎯 Interactive Features

- **Topic Selection Hub**: Interactive grid of robot-themed features
- **About Section**: Learn about the mobilepp with 8 robot characters
- **Smart Reminders**: Advanced time picker with AM/PM selection
- **Review System**: Complete CRUD operations for user reviews and ratings
- **Shopping Assistant**: E-commerce integration (coming soon)
- **Bottom Navigation**: Seamless navigation between core features

### 🎨 Modern UI/UX

- **Responsive Design**: Optimized for all screen sizes
- **Dark/Light Themes**: Consistent color scheme with black headers and white content
- **Smooth Animations**: Fluid navigation and interactions
- **Touch-Friendly**: Large buttons and intuitive gestures

## 🛠 Tech Stack

## 📁 Project Structure

```
orion/
├── App.js                                    # Main navigation container
├── README.md                                 # Comprehensive project documentation
├── package.json                              # Frontend dependencies and scripts
├── app.json                                  # Expo configuration
├── babel.config.js                           # Babel transpiler configuration
├── metro.config.js                           # Metro bundler configuration
├── tailwind.config.js                        # NativeWind/Tailwind CSS configuration
├── global.css                                # Global styling
├── index.js                                  # App entry point
├── .github/
│   └── copilot-instructions.md              # AI coding assistant instructions
├── assets/
│   ├── adaptive-icon.png                     # Android adaptive icon
│   ├── favicon.png                           # Web favicon
│   ├── homelogo.png                          # Home screen logo
│   ├── icon.png                              # App icon
│   ├── logo.png                              # Primary logo
│   ├── robots.jpg                            # Main robots image
│   └── robots/                               # Individual robot character images
│       ├── jupe.jpg
│       ├── loona.jpg
│       ├── marz.jpg
│       ├── nep.jpg
│       ├── obayy.jpg
│       ├── satu.jpg
│       ├── uro.jpg
│       └── vee.jpg
├── backend/
│   ├── server.js                             # Express server and main API
│   ├── package.json                          # Backend dependencies
│   ├── .env                                  # Environment variables template
│   ├── routes/
│   │   ├── auth.js                           # Authentication & password reset
│   │   ├── chat.js                           # AI chat functionality
│   │   ├── mood.js                           # Mood tracking endpoints
│   │   ├── music.js                          # Music streaming integration
│   │   ├── profile.js                        # User profile management
│   │   ├── reminder.js                       # Reminder system
│   │   ├── review.js                         # User reviews and ratings
│   │   ├── todo.js                           # Task management
│   │   └── user.js                           # User data operations
│   ├── models/
│   │   ├── MoodLog.js                        # Mood tracking data model
│   │   ├── Reminder.js                       # Reminder data model
│   │   ├── Review.js                         # Review data model
│   │   ├── Todo.js                           # Task data model
│   │   └── User.js                           # User data model with auth
│   ├── middleware/
│   │   ├── auth.js                           # JWT authentication middleware
│   │   └── errorHandler.js                   # Global error handling
│   ├── services/
│   │   └── jamendoAPI.js                     # Music streaming service
│   ├── utils/
│   │   ├── cloudinary.js                     # Image upload service
│   │   ├── email.js                          # Email service with Brevo SMTP
│   │   └── todoAPI.js                        # Todo utility functions
│   └── [Various test files and scripts]     # Development and testing utilities
├── src/
│   ├── api/
│   │   ├── chatAPI.js                        # AI chat API integration
│   │   └── todoAPI.js                        # Task management API
│   ├── components/
│   │   ├── BottomNavigation.js               # Tab-based navigation component
│   │   ├── Button.js                         # Reusable button component
│   │   ├── ConnectionTest.js                 # Network connectivity testing
│   │   ├── MiniMusicPlayer.js                # Compact music player
│   │   └── SignupTest.js                     # Registration testing component
│   ├── config/
│   │   └── api.js                            # API configuration and endpoints
│   ├── context/
│   │   ├── AuthContext.js                    # Authentication state management
│   │   └── MusicPlayerContext.js             # Music player state management
│   ├── screens/
│   │   ├── AboutScreen.js                    # App information and credits
│   │   ├── ChatScreen.js                     # AI conversation interface
│   │   ├── ChooseTopicScreen.js              # Topic selection for chat
│   │   ├── ForgotPasswordScreen.js           # Password reset request
│   │   ├── ResetPasswordScreen.js            # Password reset with new password
│   │   ├── FullMusicPlayerScreen.js          # Full-featured music player
│   │   ├── HomeScreen.js                     # Main dashboard
│   │   ├── MoodSelectionScreen.js            # Mood tracking interface
│   │   ├── MusicScreen.js                    # Music discovery and streaming
│   │   ├── NotificationScreen.js             # Push notification management
│   │   ├── ProfileScreen.js                  # User profile and settings
│   │   ├── ReminderScreen.js                 # Reminder creation and management
│   │   ├── ReviewsScreen.js                  # User reviews and feedback
│   │   ├── SignInScreen.js                   # User login interface
│   │   ├── SignUpScreen.js                   # User registration interface
│   │   ├── SplashScreen.js                   # App loading screen
│   │   └── toastSetup.js                     # Toast notification configuration
│   ├── services/
│   │   └── jamendoAPI.js                     # Music service integration
│   ├── test/
│      └── [Testing utilities]               # Component and integration tests
│                                
└── [Various guide and documentation files]   # Development guides and documentation
```

### Frontend

- **React Native** - Cross-platform mobile development
- **Expo SDK 54** - Development platform and native APIs with deep linking
- **React Navigation v6** - Stack-based navigation system with URL support
- **React Context API** - Global state management
- **AsyncStorage** - Persistent local storage for user/session data
- **Expo Vector Icons** - Comprehensive icon library
- **Expo Image Picker** - Camera and gallery integration
- **Expo Audio** - Modern audio playback and recording
- **Expo Speech** - Text-to-speech functionality
- **Expo File System** - Permanent file storage
- **NativeWind** - Tailwind CSS for React Native
- **StyleSheet API** - Native styling solution
- **Axios** - HTTP client for API requests
- **JavaScript ES6+** - Modern JavaScript features

### Backend

- **Node.js & Express.js** - REST API server
- **MongoDB & Mongoose** - NoSQL database and ODM
- **JWT Authentication** - Secure token-based auth with automatic expiration
- **BcryptJS** - Password hashing and security
- **Nodemailer** - Professional email service with HTML templates
- **Brevo SMTP** - Email delivery service provider
- **Crypto** - Secure token generation for password resets
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management
- **Express Rate Limit** - API rate limiting for security
- **Cloudinary** - Image upload and management

### Email & Communication

- **Brevo SMTP Service** - Professional email delivery platform
- **HTML Email Templates** - Beautiful branded password reset emails
- **Deep Link Support** - Mobile app and web URL handling
- **Email Debugging** - Comprehensive logging and error tracking

### AI & External APIs

- **Google Gemini AI** - Advanced conversational AI (Gemini 1.5 Flash)
- **Jamendo API** - Royalty-free music streaming
- **Audio/Speech APIs** - Text-to-speech (TTS)
- **Cloudinary API** - Image hosting and transformation

## 📱 Screens Overview

| Screen                   | Description           | Features                                                                                       |
| ------------------------ | --------------------- | ---------------------------------------------------------------------------------------------- |
| **SplashScreen**         | App entry point       | Branding, navigation to auth                                                                   |
| **SignInScreen**         | User authentication   | Email/password login, social auth                                                              |
| **SignUpScreen**         | User registration     | Form validation, privacy policy                                                                |
| **ForgotPasswordScreen** | Password recovery     | Email input, validation, reset request                                                         |
| **ResetPasswordScreen**  | Secure password reset | Token validation, password strength indicators, real-time validation                           |
| **HomeScreen**           | Main dashboard        | Welcome message, navigation hub                                                                |
| **ChooseTopicScreen**    | Feature selection     | 6 interactive topic cards with icons                                                           |
| **AboutScreen**          | Robot information     | 8 robot characters, STEM education                                                             |
| **ReminderScreen**       | Task management       | Advanced time picker, reminder setting                                                         |
| **ReviewsScreen**        | Review system         | Add, edit, delete, rate (1-5 stars)                                                            |
| **ProfileScreen**        | User management       | Profile editing, image upload, settings                                                        |
| **ChatScreen**           | AI Chatbot            | Gemini AI, voice recording, TTS                                                                |
| **MoodSelectionScreen**  | Mood logging          | Choose and log mood, triggers mood-based music recommendations                                 |
| **MusicScreen**          | Music player          | Jamendo streaming, mood-based recommendations, mood display, stress/sad relief music, clean UI |

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
   # Database Configuration
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Email Service Configuration (Brevo SMTP)
   SMTP_HOST=smtp-relay.brevo.com
   SMTP_PORT=587
   SMTP_USER="your-brevo-smtp-user@smtp-brevo.com"
   SMTP_PASS="your-brevo-smtp-password"
   SENDER_EMAIL="your-sender-email@gmail.com"

   # Frontend URL (for email links)
   FRONTEND_URL=http://localhost:19006
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

#### Brevo Email Service (Free Tier Available)

1. Go to [Brevo (formerly Sendinblue)](https://www.brevo.com/)
2. Create account and navigate to SMTP & API settings
3. Generate SMTP credentials
4. Add to backend `.env` file:
   ```env
   SMTP_USER="your-generated-smtp-user@smtp-brevo.com"
   SMTP_PASS="your-generated-smtp-password"
   SENDER_EMAIL="your-verified-sender-email@gmail.com"
   ```

### 📱 Testing on Device

1. Install **Expo Go** from App Store/Google Play
2. Scan the QR code from the terminal/browser
3. The app will load on your device

## 📁 Project Structure

```
orion/
├── src/
│   ├── screens/
│   │   ├── SplashScreen.js         # Welcome/landing screen
│   │   ├── SignInScreen.js         # User authentication
│   │   ├── SignUpScreen.js         # User registration
│   │   ├── ForgotPasswordScreen.js # Password recovery request
│   │   ├── ResetPasswordScreen.js  # Secure password reset with validation
│   │   ├── HomeScreen.js           # Main dashboard
│   │   ├── ChooseTopicScreen.js    # Topic selection grid
│   │   ├── AboutScreen.js          # Robot information & education
│   │   ├── ReminderScreen.js       # Time management features
│   │   ├── ReviewsScreen.js        # Review and rating system
│   │   ├── ProfileScreen.js        # User profile management
│   │   ├── ChatScreen.js           # AI chatbot with voice features
│   │   └── MusicScreen.js          # Music streaming player
│   ├── components/
│   │   └── BottomNavigation.js     # App-wide navigation component
│   ├── context/
│   │   ├── ProfileContext.js       # Profile state management
│   │   └── AuthContext.js          # Authentication state
│   ├── config/
│   │   ├── api.js                  # Backend API configuration
│   │   ├── chatConfig.js           # Gemini AI & TTS configuration
│   │   └── musicConfig.js          # Jamendo API configuration
│   ├── services/
│   │   └── jamendoAPI.js           # Jamendo music service
│   └── api/                        # API service layers
├── backend/
│   ├── models/                     # MongoDB data models
│   ├── routes/                     # Express API routes (auth, profile, etc.)
│   ├── middleware/                 # Authentication middleware
│   ├── utils/
│   │   ├── email.js               # Email service with Brevo SMTP
│   │   └── ...                    # Other utility functions
│   └── server.js                  # Main server file
├── assets/
│   ├── robots/                    # Robot character images
│   └── [app icons]               # App icons and splash images
├── App.js                         # Main navigation container with deep linking
├── package.json                   # Frontend dependencies
└── README.md                      # Project documentation
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

### 🔐 Complete Authentication System

- **Secure Sign In/Up**: JWT token-based authentication with bcrypt password hashing
- **Forgot Password Flow**: Email-based password recovery with secure token generation
- **Reset Password Screen**: Beautiful UI with real-time validation and password strength indicators
- **Email Integration**: Professional HTML emails with ORION branding via Brevo SMTP
- **Deep Link Support**: Mobile app and web URL compatibility for password reset links
- **Token Security**: Crypto-secure tokens with 10-minute expiration for password resets
- **Comprehensive Validation**: Email format validation and password strength requirements

### 📧 Advanced Email System

- **Brevo SMTP Integration**: Professional email delivery with high deliverability rates
- **Beautiful Email Templates**: HTML emails with ORION branding and responsive design
- **Email Debugging**: Comprehensive logging, error handling, and development mode tokens
- **Mobile-First URLs**: Support for both deep links (`orionrobot://`) and web URLs
- **Production Ready**: Environment-based configuration for development and production
- **Error Recovery**: Graceful fallbacks and user-friendly error messages

### 🤖 AI Chatbot Features

- **Google Gemini Integration**: Advanced conversational AI with context awareness
- **Text-to-Speech**: AI responses read aloud automatically
- **Chat History**: Persistent conversation storage in MongoDB
- **Modern Audio API**: Replaced deprecated expo-permissions with Audio API
- **Real-time Responses**: Streaming responses with loading indicators

### 🎵 Advanced Music Streaming Features

- **Jamendo Integration**: Access thousands of royalty-free tracks
- **Mood-Based Recommendations**: Intelligent music suggestions based on user's emotional state
- **Advanced Search**: Search by song title, artist, or keywords
- **Background Playback**: Music continues while using other features
- **Mini & Full Player**: Compact and expanded player interfaces with album art
- **Stress Relief Mode**: Automatic chill/ambient music for stressed users
- **Uplifting Mode**: Happy/inspirational tracks for sad moods
- **Clean UI**: Streamlined interface without genre chips for better UX

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

**Email Service Not Working:**

```bash
# Check Brevo SMTP credentials in backend/.env
# Verify SMTP_USER, SMTP_PASS, and SENDER_EMAIL are correct
# Test email service with: node test-simple-email.js
# Check email logs in backend console for debugging info
```

**Password Reset Issues:**

```bash
# Verify email service is configured properly
# Check that FRONTEND_URL matches your app URL
# Test reset flow: ForgotPassword → Email → ResetPassword screen
# Ensure deep linking is configured in app.json
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

**Deep Linking Not Working:**

```bash
# Ensure app.json has proper scheme configuration
# Check linking configuration in App.js
# Test with: exp://192.168.1.4:8081/--/reset-password/token
# Verify emulator/device can access your network IP
```

**Brevo Email Setup:**

```bash
# Get SMTP credentials from Brevo dashboard
# Use format: "username@smtp-brevo.com" for SMTP_USER
# Verify sender email is added to Brevo account
# Test connection with simple-email-test.js
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
- Test email functionality in development mode (tokens logged to console)
- Use test buttons in ForgotPasswordScreen for easy ResetPassword testing
- Monitor backend logs for email sending status and errors

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
