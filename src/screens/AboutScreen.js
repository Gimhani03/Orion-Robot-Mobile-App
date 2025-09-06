import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigation from '../components/BottomNavigation';

export default function AboutScreen({ navigation }) {
     const robotTypes = [
    {
      id: 1,
      name: 'OBAYY',
      image: require('../../assets/robots/obayy.jpg'), // You'll need to add these images
      backgroundColor: '#60a5fa',
      description: 'Ocean-inspired companion'
    },
    {
      id: 2,
      name: 'LOONA',
      image: require('../../assets/robots/loona.jpg'),
      backgroundColor: '#e5e7eb',
      description: 'Lunar exploration bot'
    },
     {
      id: 3,
      name: 'JUPE',
      image: require('../../assets/robots/jupe.jpg'),
      backgroundColor: '#fb923c',
      description: 'Jupiter research assistant'
    },
    {
      id: 4,
      name: 'VEE',
      image: require('../../assets/robots/vee.jpg'),
      backgroundColor: '#fcd9ac',
      description: 'Venus environment specialist'
    },
    {
      id: 5,
      name: 'SATU',
      image: require('../../assets/robots/satu.jpg'),
      backgroundColor: '#e8b176',
      description: 'Jupiter research assistant'
    },
    {
      id: 6,
      name: 'NEP',
      image: require('../../assets/robots/nep.jpg'),
      backgroundColor: '#60a5fa',
      description: 'Venus environment specialist'
    },
    {
      id: 7,
      name: 'URO',
      image: require('../../assets/robots/uro.jpg'),
      backgroundColor: '#fb923c',
      description: 'Jupiter research assistant'
    },
    {
      id: 8,
      name: 'MARZ',
      image: require('../../assets/robots/marz.jpg'),
      backgroundColor: '#f0545c',
      description: 'Venus environment specialist'
    }
  ];
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        <StatusBar style="light" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
      </View>

      {/* Robot Image */}
      <View style={styles.imageContainer}>
       
          {/* This would be replaced with actual robot image */}
          <Image source={require('../../assets/robots.jpg')} style={{ width: 335, height: 200, borderRadius: 16 }} />
        
      </View>

      {/* Description Text */}
      <View style={styles.textContainer}>
        <Text style={styles.description}>
          The Orion robot is a compact, moon-inspired desktop companion influenced by the solar system. Seamlessly connected to a mobile app, it responds to the user's emotional state in real time promoting focus with subtle visual cues and offering calming lights and music during moments of stress. With a minimalist, armless design, Orion blends cosmic inspiration, wellness, and technology to provide quiet emotional support and a thoughtful presence.
        </Text>
      </View>

       <Text style={styles.title}>Types of ORION ROBOTS</Text>
        <View style={styles.robotGrid}>
          {robotTypes.map((robot) => (
            
            <TouchableOpacity
              key={robot.id}
              style={styles.robotCard}
              onPress={() => console.log(`Selected ${robot.name}`)}
            >
              <View style={[styles.robotImageContainer, { backgroundColor: robot.backgroundColor }]}>
                {/* Robot Image - Replace with actual images */}
                {                  <Image source={robot.image} style={{ width: '100%', height: '100%', borderRadius: 12 }} />}
              </View>
               <Text style={styles.robotName}>{robot.name}</Text> 
            </TouchableOpacity>
          
           
          ))
        }
      </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentScreen="About" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8e9eb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor:'#000'
    
  },
  backButton: {
    width: 40,
    height: 40,
    
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
   title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 24,
    paddingVertical: 19,
    paddingBottom: 25,
  },
  imageContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 30,
  },
  robotImagePlaceholder: {
    backgroundColor: '#8b4513',
    borderRadius: 16,
    padding: 30,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  robotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  robotItem: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 5,
  },
  robotBody: {
    width: 35,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  robotFace: {
    alignItems: 'center',
  },
  robotEyes: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  eye: {
    width: 4,
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    marginHorizontal: 1,
  },
  robotMouth: {
    width: 6,
    height: 2,
    backgroundColor: '#000',
    borderRadius: 1,
  },
  robotLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  textContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify',
  },
  robotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between' ,
    paddingBottom: 20,
    paddingLeft: 24,
    paddingRight: 24,
  },
  robotCard: {
    width: '48%',
    marginBottom: 20,
    alignItems: 'center',
  },
  robotImageContainer: {
    width: '100%',
    aspectRatio: 0.8,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
   robotPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
   robotBase: {
    width: 60,
    height: 20,
    backgroundColor: '#666',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  robotBaseText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  robotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  }
});
