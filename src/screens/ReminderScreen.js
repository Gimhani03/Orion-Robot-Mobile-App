import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import NavigationBar from 'react-native-navigation-bar-color';
import BottomNavigation from '../components/BottomNavigation';

export default function ReminderScreen({ navigation }) {
  const [editingReminder, setEditingReminder] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [reminders, setReminders] = useState([]);
  const [loadingReminders, setLoadingReminders] = useState(false);
  const { user } = useAuth();
  const [selectedHour, setSelectedHour] = useState(11);
  const [selectedMinute, setSelectedMinute] = useState(30);
  const [selectedPeriod, setSelectedPeriod] = useState('AM');
  const [selectedDays, setSelectedDays] = useState(['M', 'T', 'W', 'TH', 'F']);

  const hourScrollRef = useRef(null);
  const minuteScrollRef = useRef(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const days = [
    { short: 'SU', full: 'Sunday' },
    { short: 'M', full: 'Monday' },
    { short: 'T', full: 'Tuesday' },
    { short: 'W', full: 'Wednesday' },
    { short: 'TH', full: 'Thursday' },
    { short: 'F', full: 'Friday' },
    { short: 'S', full: 'Saturday' }
  ];

  const handleHourScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / 40);
    const hour = hours[index];
    if (hour && hour !== selectedHour) {
      setSelectedHour(hour);
    }
  };

  const handleMinuteScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / 40);
    const minute = minutes[index];
    if (minute !== undefined && minute !== selectedMinute) {
      setSelectedMinute(minute);
    }
  };

  const scrollToHour = (hour) => {
    const index = hours.indexOf(hour);
    if (index !== -1 && hourScrollRef.current) {
      const scrollY = index * 40;
      hourScrollRef.current.scrollTo({ y: scrollY, animated: true });
    }
  };

  const scrollToMinute = (minute) => {
    const index = minutes.indexOf(minute);
    if (index !== -1 && minuteScrollRef.current) {
      const scrollY = index * 40;
      minuteScrollRef.current.scrollTo({ y: scrollY, animated: true });
    }
  };

  useEffect(() => {
    // Initial scroll to selected values with proper centering
    setTimeout(() => {
      scrollToHour(selectedHour);
      scrollToMinute(selectedMinute);
    }, 200);

    // Fetch reminders for the user
    if (user && (user.id || user._id)) {
      setLoadingReminders(true);
      fetch(`http://192.168.1.3:5000/api/reminders/${user.id || user._id}`)
        .then(res => res.json())
        .then(result => {
          if (result.success) {
            setReminders(result.data);
          } else {
            setReminders([]);
            console.error('Failed to fetch reminders:', result.error);
          }
        })
        .catch(error => {
          setReminders([]);
          console.error('Error fetching reminders:', error);
        })
        .finally(() => setLoadingReminders(false));
  // Reset edit state when reminders change
  setEditingReminder(null);
  setEditTitle('');
  setEditDescription('');
    }
  }, [user]);



  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSave = () => {
    if (!user || !(user.id || user._id)) {
      console.error('No user found. Please log in.');
      return;
    }
    const reminderData = {
      user: user.id || user._id,
      title: 'Study Reminder',
      description: `Study at ${selectedHour}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod} on ${selectedDays.join(', ')}`,
      date: new Date(),
      isCompleted: false,
    };
    fetch('http://192.168.1.3:5000/api/reminders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reminderData),
    })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          console.log('Reminder saved:', result.data);
          navigation.goBack();
        } else {
          console.error('Failed to save reminder:', result.error);
        }
      })
      .catch(error => {
        console.error('Error saving reminder:', error);
      });
  };
  

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
        <Text style={styles.headerTitle}>Reminder</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Content */}
        <View style={styles.content}>
          {/* Time Selection */}
          <Text style={styles.questionTitle}>What time would you like to study?</Text>
        <Text style={styles.questionSubtitle}>
          Any time you can choose but We recommend first thing in th morning.
        </Text>

        {/* Time Picker */}
        <View style={styles.timePickerContainer}>
          <View style={styles.timePicker}>
            {/* Hours */}
            <View style={styles.timeColumn}>
              <ScrollView 
                ref={hourScrollRef}
                showsVerticalScrollIndicator={false} 
                snapToInterval={40}
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContent}
                onMomentumScrollEnd={handleHourScroll}
              >
                {hours.map((hour, index) => (
                  <TouchableOpacity
                    key={hour}
                    style={styles.timeItem}
                    onPress={() => {
                      setSelectedHour(hour);
                      scrollToHour(hour);
                    }}
                  >
                    <Text style={styles.hiddenTimeText}>
                      {hour}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {/* Selection indicator overlay with 3 values */}
              <View style={styles.selectionIndicator}>
                <View style={styles.pickerWheel}>
                  <Text style={styles.timeText}>
                    {selectedHour === 1 ? 12 : selectedHour - 1}
                  </Text>
                  <Text style={styles.selectedTimeText}>{selectedHour}</Text>
                  <Text style={styles.timeText}>
                    {selectedHour === 12 ? 1 : selectedHour + 1}
                  </Text>
                </View>
              </View>
            </View>

            {/* Minutes */}
            <View style={styles.timeColumn}>
              <ScrollView 
                ref={minuteScrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={40}
                decelerationRate="fast"
                contentContainerStyle={styles.scrollContent}
                onMomentumScrollEnd={handleMinuteScroll}
              >
                {minutes.map((minute, index) => (
                  <TouchableOpacity
                    key={minute}
                    style={styles.timeItem}
                    onPress={() => {
                      setSelectedMinute(minute);
                      scrollToMinute(minute);
                    }}
                  >
                    <Text style={styles.hiddenTimeText}>
                      {minute.toString().padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {/* Selection indicator overlay with 3 values */}
              <View style={styles.selectionIndicator}>
                <View style={styles.pickerWheel}>
                  <Text style={styles.timeText}>
                    {(selectedMinute === 0 ? 59 : selectedMinute - 1).toString().padStart(2, '0')}
                  </Text>
                  <Text style={styles.selectedTimeText}>{selectedMinute.toString().padStart(2, '0')}</Text>
                  <Text style={styles.timeText}>
                    {(selectedMinute === 59 ? 0 : selectedMinute + 1).toString().padStart(2, '0')}
                  </Text>
                </View>
              </View>
            </View>

            {/* AM/PM */}
            <View style={styles.timeColumn}>
              <View style={styles.periodContainer}>
                <TouchableOpacity 
                  style={[styles.timeItem, styles.periodItem]}
                  onPress={() => setSelectedPeriod('AM')}
                >
                  <Text style={[
                    styles.timeText,
                    selectedPeriod === 'AM' && styles.selectedTimeText
                  ]}>
                    AM
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.timeItem, styles.periodItem]}
                  onPress={() => setSelectedPeriod('PM')}
                >
                  <Text style={[
                    styles.timeText,
                    selectedPeriod === 'PM' && styles.selectedTimeText
                  ]}>
                    PM
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Day Selection */}
        <Text style={styles.questionTitle}>Which day would you like to study?</Text>
        <Text style={styles.questionSubtitle}>
          Everyday is best, but we recommend picking at least five.
        </Text>

        <View style={styles.daysContainer}>
          {days.map((day) => (
            <TouchableOpacity
              key={day.short}
              style={[
                styles.dayButton,
                selectedDays.includes(day.short) && styles.selectedDayButton
              ]}
              onPress={() => toggleDay(day.short)}
            >
              <Text style={[
                styles.dayText,
                selectedDays.includes(day.short) && styles.selectedDayText
              ]}>
                {day.short}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Saved Reminders List */}
        <Text style={styles.questionTitle}>Your Saved Reminders</Text>
        {loadingReminders ? (
          <Text style={{ color: '#888', marginVertical: 8 }}>Loading reminders...</Text>
        ) : reminders.length === 0 ? (
          <Text style={{ color: '#888', marginVertical: 8 }}>No reminders found.</Text>
        ) : (
          <View style={{ marginBottom: 16 }}>
            {reminders.map(reminder => (
              <View key={reminder._id} style={{ backgroundColor: '#222', borderRadius: 16, padding: 12, marginBottom: 8 }}>
                  {editingReminder === reminder._id ? (
                    <View>
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>Edit Reminder</Text>
                      <TextInput
                        style={{ color: '#fff', backgroundColor: '#333', borderRadius: 8, padding: 8, marginVertical: 4 }}
                        value={editTitle}
                        onChangeText={setEditTitle}
                        placeholder="Title"
                        placeholderTextColor="#888"
                      />
                      <TextInput
                        style={{ color: '#fff', backgroundColor: '#333', borderRadius: 8, padding: 8, marginVertical: 4 }}
                        value={editDescription}
                        onChangeText={setEditDescription}
                        placeholder="Description"
                        placeholderTextColor="#888"
                      />
                      <View style={{ flexDirection: 'row', marginTop: 8 }}>
                        <TouchableOpacity
                          style={{ backgroundColor: '#4f8ef7', borderRadius: 8, padding: 8, marginRight: 8 }}
                          onPress={() => {
                            // Save edit
                            fetch(`http://192.168.1.3:5000/api/reminders/${reminder._id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ title: editTitle, description: editDescription }),
                            })
                              .then(res => res.json())
                              .then(result => {
                                if (result.success) {
                                  // Refresh reminders
                                  setEditingReminder(null);
                                  setEditTitle('');
                                  setEditDescription('');
                                  // Refetch reminders
                                  fetch(`http://192.168.1.3:5000/api/reminders/${user.id || user._id}`)
                                    .then(res => res.json())
                                    .then(result => {
                                      if (result.success) setReminders(result.data);
                                    });
                                } else {
                                  console.error('Failed to update reminder:', result.error);
                                }
                              })
                              .catch(error => console.error('Error updating reminder:', error));
                          }}
                        >
                          <Text style={{ color: '#fff' }}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ backgroundColor: '#888', borderRadius: 8, padding: 8 }}
                          onPress={() => setEditingReminder(null)}
                        >
                          <Text style={{ color: '#fff' }}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{reminder.title}</Text>
                      <Text style={{ color: '#ccc', marginTop: 2 }}>{reminder.description}</Text>
                      <Text style={{ color: '#4f8ef7', marginTop: 2, fontSize: 12 }}>Date: {new Date(reminder.date).toLocaleString()}</Text>
                      <View style={{ flexDirection: 'row', marginTop: 8 }}>
                        <TouchableOpacity
                          style={{ backgroundColor: '#4f8ef7', borderRadius: 8, padding: 8, marginRight: 8 }}
                          onPress={() => {
                            setEditingReminder(reminder._id);
                            setEditTitle(reminder.title);
                            setEditDescription(reminder.description);
                          }}
                        >
                          <Text style={{ color: '#fff' }}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ backgroundColor: '#e74c3c', borderRadius: 8, padding: 8 }}
                          onPress={() => {
                            // Delete reminder
                            fetch(`http://192.168.1.3:5000/api/reminders/${reminder._id}`, {
                              method: 'DELETE',
                            })
                              .then(res => res.json())
                              .then(result => {
                                if (result.success) {
                                  // Refetch reminders
                                  fetch(`http://192.168.1.3:5000/api/reminders/${user.id || user._id}`)
                                    .then(res => res.json())
                                    .then(result => {
                                      if (result.success) setReminders(result.data);
                                    });
                                } else {
                                  console.error('Failed to delete reminder:', result.error);
                                }
                              })
                              .catch(error => console.error('Error deleting reminder:', error));
                          }}
                        >
                          <Text style={{ color: '#fff' }}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>SAVE</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.noThanksButton} onPress={() => navigation.goBack()}>
            <Text style={styles.noThanksButtonText}>NO THANKS</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentScreen="Reminder" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Add padding for bottom navigation
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginRight: 16,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
    lineHeight: 28,
  },
  questionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    lineHeight: 20,
  },
  timePickerContainer: {
    marginBottom: 40,
  },
  timePicker: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 20,
    height: 150,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  timeColumn: {
    flex: 1,
    height: '100%',
    position: 'relative',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 60, // Simplified padding for smoother scrolling
  },
  timeItem: {
    paddingVertical: 8,
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 20,
    color: '#ccc',
    fontWeight: '300',
  },
  hiddenTimeText: {
    fontSize: 20,
    color: 'rgba(0,0,0,0.01)',
    fontWeight: '300',
  },
  selectedTimeText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 24,
  },
  selectionIndicator: {
    position: 'absolute',
    top: '50%',
    left: 10,
    right: 10,
    height: 120,
    marginTop: -60,
    backgroundColor: 'rgba(245,245,245,0.95)',
    borderRadius: 8,
    pointerEvents: 'none',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerWheel: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingVertical: 10,
  },
  periodContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  periodItem: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
    paddingHorizontal: 12,
    minWidth: 50,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 60,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#000',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  selectedDayText: {
    color: '#fff',
  },
  buttonContainer: {
    gap: 16,
    paddingBottom: 40,
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noThanksButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  noThanksButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
