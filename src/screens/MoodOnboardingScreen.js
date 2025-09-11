import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const moodQuestions = [
  { id: '1', question: 'How are you feeling today?', icon: 'emoticon-happy-outline' },
  { id: '2', question: 'What best describes your current mood?', icon: 'emoticon-neutral-outline' },
  { id: '3', question: 'Are you looking for something relaxing or energetic?', icon: 'emoticon-cool-outline' },
  { id: '4', question: 'Would you like to boost your mood?', icon: 'emoticon-excited-outline' },
  { id: '5', question: 'Do you want music or chat recommendations based on your mood?', icon: 'emoticon-wink-outline' },
];

const moodOptions = [
  { label: '😊 Happy', color: '#2563eb' },
  { label: '😔 Sad', color: '#6b7280' },
  { label: '😐 Neutral', color: '#facc15' },
  { label: '😡 Angry', color: '#f87171' },
  { label: '😌 Relaxed', color: '#4ade80' },
];

export default function MoodOnboardingScreen({ navigation }) {
  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < moodQuestions.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('ChooseTopic');
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.slide, { width }]}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name={item.icon} size={64} color="#2563eb" />
        </View>
        <Text style={styles.questionText}>{item.question}</Text>
        <View style={styles.moodOptionsRow}>
          {moodOptions.map(option => (
            <TouchableOpacity
              key={option.label}
              style={[styles.moodButton, { backgroundColor: option.color }]}
              activeOpacity={0.8}
            >
              <Text style={styles.moodButtonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsRow}>
      {moodQuestions.map((_, idx) => (
        <View
          key={idx}
          style={[styles.dot, idx === currentIndex ? styles.dotActive : styles.dotInactive]}
        />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={moodQuestions}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        extraData={currentIndex}
        style={{ flexGrow: 0 }}
      />
      <View style={styles.dotsContainer}>
        {renderDots()}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex < moodQuestions.length - 1 ? 'Next' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7fe',
    justifyContent: 'center',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    minHeight: 400,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  iconCircle: {
    backgroundColor: '#dbeafe',
    borderRadius: 48,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#222',
    letterSpacing: 0.2,
  },
  moodOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 12,
  },
  moodButton: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 4,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 3,
    elevation: 2,
  },
  moodButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#2563eb',
  },
  dotInactive: {
    backgroundColor: '#d1d5db',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: 'black',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});