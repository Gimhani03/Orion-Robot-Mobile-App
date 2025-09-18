import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from '../components/BottomNavigation';
import MotivationalQuotesService from '../services/motivationalQuotes';

const NOTIFICATION_TYPES = {
  MOTIVATIONAL: 'motivational',
  REMINDER: 'reminder',
  ACHIEVEMENT: 'achievement',
  SYSTEM: 'system'
};

export default function NotificationScreen({ navigation }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userMood, setUserMood] = useState(null);
  const [userReminders, setUserReminders] = useState([]);

  useEffect(() => {
    fetchUserMood();
    fetchUserReminders();
  }, []);

  useEffect(() => {
    // Regenerate notifications when reminders or mood changes
    generateNotifications();
  }, [userReminders, userMood]);

  const fetchUserMood = async () => {
    if (!user || !(user.id || user._id)) return;
    
    try {
      const res = await fetch(`http://192.168.1.4:5000/api/moods/${user.id || user._id}/latest`);
      const result = await res.json();
      if (result.success && result.data) {
        setUserMood(result.data.mood);
      }
    } catch (error) {
      console.error('Error fetching mood:', error);
    }
  };

  const fetchUserReminders = async () => {
    if (!user || !(user.id || user._id)) return;
    
    try {
      const res = await fetch(`http://192.168.1.4:5000/api/reminders/${user.id || user._id}`);
      const result = await res.json();
      if (result.success && result.data) {
        setUserReminders(result.data);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  const generateNotifications = () => {
    const currentTime = new Date();
    const mockNotifications = [
      {
        id: 1,
        type: NOTIFICATION_TYPES.SYSTEM,
        title: 'Welcome Back!',
        message: 'Ready to continue your learning journey?',
        time: new Date(currentTime.getTime() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        icon: 'hand-wave'
      }
    ];

    // Add study reminder notifications that match the toast notifications
    userReminders.forEach((reminder, index) => {
      if (!reminder.date) return;
      
      const reminderTime = new Date(reminder.date);
      const now = new Date();
      
      // Check if this reminder should have shown a toast (30 minutes before or already passed)
      const toastTime = new Date(reminderTime.getTime() - 30 * 60 * 1000); // 30 minutes before
      
      if (now >= toastTime) {
        // This reminder should appear in notifications (either toast was shown or time passed)
        const studyNotification = {
          id: `reminder_${reminder._id || index}`,
          type: NOTIFICATION_TYPES.REMINDER,
          title: 'Study Reminder',
          message: `Your study reminder "${reminder.title || 'Study'}" is in 30 minutes!`, // Match toast content
          time: toastTime, // Show when the toast would have appeared
          read: false,
          icon: 'school',
          reminderData: reminder
        };
        
        mockNotifications.push(studyNotification);
      }
    });

    // Add mood-based motivational quote only if user has logged mood
    if (userMood && MotivationalQuotesService.hasMoodQuotes(userMood)) {
      const quoteData = MotivationalQuotesService.getQuoteWithMetadata(userMood);
      
      const motivationalNotification = {
        id: Date.now(),
        type: NOTIFICATION_TYPES.MOTIVATIONAL,
        title: 'Daily Motivation',
        message: quoteData.quote,
        time: new Date(currentTime.getTime() - 5 * 60 * 1000), // 5 minutes ago
        read: false,
        icon: 'heart',
        mood: userMood
      };
      
      mockNotifications.unshift(motivationalNotification);
    }

    setNotifications(mockNotifications.sort((a, b) => b.time - a.time));
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserMood();
    fetchUserReminders();
    setTimeout(() => {
      generateNotifications();
      setRefreshing(false);
    }, 1000);
  };

  const getNotificationIcon = (type, iconName) => {
    const iconProps = { size: 24, color: '#fff' };
    
    switch (type) {
      case NOTIFICATION_TYPES.MOTIVATIONAL:
        return <MaterialIcons name="favorite" {...iconProps} />;
      case NOTIFICATION_TYPES.REMINDER:
        return <MaterialIcons name="schedule" {...iconProps} />;
      case NOTIFICATION_TYPES.ACHIEVEMENT:
        return <MaterialIcons name="emoji-events" {...iconProps} />;
      case NOTIFICATION_TYPES.SYSTEM:
        return <MaterialIcons name="info" {...iconProps} />;
      default:
        return <MaterialIcons name="notifications" {...iconProps} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.MOTIVATIONAL:
        return '#e74c3c';
      case NOTIFICATION_TYPES.REMINDER:
        return '#f39c12';
      case NOTIFICATION_TYPES.ACHIEVEMENT:
        return '#27ae60';
      case NOTIFICATION_TYPES.SYSTEM:
        return '#3498db';
      default:
        return '#95a5a6';
    }
  };

  const formatTime = (time) => {
    const now = new Date();
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Notifications List */}
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="notifications-none" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>Pull down to refresh</Text>
          </View>
        ) : (
          <View style={styles.notificationsList}>
            {notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationCard,
                  !notification.read && styles.unreadNotification
                ]}
                onPress={() => markAsRead(notification.id)}
              >
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: getNotificationColor(notification.type) }
                ]}>
                  {getNotificationIcon(notification.type, notification.icon)}
                </View>
                
                <View style={styles.notificationContent}>
                  <View style={styles.notificationHeader}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {formatTime(notification.time)}
                    </Text>
                  </View>
                  
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  
                  {notification.mood && (
                    <View style={styles.moodBadge}>
                      <Text style={styles.moodBadgeText}>
                        Based on your {notification.mood} mood
                      </Text>
                    </View>
                  )}
                </View>
                
                {!notification.read && (
                  <View style={styles.unreadDot} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentScreen="Notifications" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  notificationsList: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    marginRight: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  moodBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#e8f4fd',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  moodBadgeText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginLeft: 8,
    marginTop: 4,
  },
});
