import React from 'react';
import Toast from 'react-native-toast-message';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import SplashScreen from './src/screens/SplashScreen';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import HomeScreen from './src/screens/HomeScreen';
import MoodSelectionScreen from './src/screens/MoodSelectionScreen';
import ChooseTopicScreen from './src/screens/ChooseTopicScreen';
import AboutScreen from './src/screens/AboutScreen';
import ReminderScreen from './src/screens/ReminderScreen';
import ReviewsScreen from './src/screens/ReviewsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ChatScreen from './src/screens/ChatScreen';
import MusicScreen from './src/screens/MusicScreen';
import NotificationScreen from './src/screens/NotificationScreen';

// Import context
import { ProfileProvider } from './src/context/ProfileContext';
import { AuthProvider } from './src/context/AuthContext';
import { MusicPlayerProvider } from './src/context/MusicPlayerContext';
// import MiniMusicPlayer from './src/components/MiniMusicPlayer';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <MusicPlayerProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            {/* MiniMusicPlayer is now rendered only in MusicScreen */}
            <Stack.Navigator 
              initialRouteName="Splash"
              screenOptions={{
              headerShown: false,
            }}
            >
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="MoodSelection" component={MoodSelectionScreen} />
              <Stack.Screen name="ChooseTopic" component={ChooseTopicScreen} />
              <Stack.Screen name="About" component={AboutScreen} />
              <Stack.Screen name="Reminder" component={ReminderScreen} />
              <Stack.Screen name="Reviews" component={ReviewsScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="Music" component={MusicScreen} />
              <Stack.Screen name="Notification" component={NotificationScreen} />
            </Stack.Navigator>
            <Toast />
          </NavigationContainer>
        </MusicPlayerProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
