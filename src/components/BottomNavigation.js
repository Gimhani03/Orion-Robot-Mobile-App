import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavigation({ navigation, currentScreen = 'Home' }) {
  const navItems = [
    {
      name: 'Home',
      icon: 'home',
      iconOutline: 'home-outline',
      route: 'ChooseTopic'
    },
    {
      name: 'Music',
      icon: 'musical-note',
      iconOutline: 'musical-note-outline',
      route: 'Music'
    },
    {
      name: 'Chat',
      icon: 'chatbubble',
      iconOutline: 'chatbubble-outline',
      route: 'Chat'
    },
    {
      name: 'Profile',
      icon: 'person',
      iconOutline: 'person-outline',
      route: 'Profile'
    }
  ];

  const handleNavigation = (route) => {
    navigation.navigate(route);
  };

  return (
    <View style={styles.bottomNavigation}>
      {navItems.map((item) => {
        const isActive = currentScreen === item.name;
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navButton}
            onPress={() => handleNavigation(item.route)}
          >
            <Ionicons
              name={isActive ? item.icon : item.iconOutline}
              size={24}
              color={isActive ? '#2563eb' : '#6b7280'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navButton: {
    padding: 8,
  },
});
