import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons, FontAwesome5, Entypo, AntDesign, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import BottomNavigation from '../components/BottomNavigation';
import todoAPI from '../api/todoAPI';
import MotivationalQuotesService from '../services/motivationalQuotes';

export default function ChooseTopicScreen({ navigation }) {
  // Delete todo with confirmation
  const handleDeleteTask = (id) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await todoAPI.deleteTodo(id);
              setTasks(tasks.filter(task => task.id !== id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task.');
            }
          }
        }
      ]
    );
  };
  // Save edited todo text and exit edit mode
  const handleSaveEdit = async () => {
    if (!editingText.trim()) return;
    try {
      await todoAPI.updateTodo(editingTaskId, { text: editingText });
      setTasks(tasks.map(task =>
        task.id === editingTaskId ? { ...task, text: editingText } : task
      ));
      setEditingTaskId(null);
      setEditingText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes.');
    }
  };
  // Ensure handleEditTask is defined
  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  // Ensure handleDeleteTask is defined (already patched above)
  // If already present, this will not duplicate
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const { profileImage } = useProfile();
  const { user } = useAuth();
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [motivationalQuote, setMotivationalQuote] = useState('" Welcome to your learning journey"');
  const [userMood, setUserMood] = useState(null);

  // Load todos from backend when component mounts
  useEffect(() => {
    loadTodos();
    fetchUserMoodAndQuote();
  }, []);

  // Refresh motivational quote when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserMoodAndQuote();
    }, [])
  );

  const fetchUserMoodAndQuote = async () => {
    if (!user || !(user.id || user._id)) {
      // If no user, show default motivational message
      setMotivationalQuote('" Welcome to your learning journey"');
      return;
    }
    
    try {
      const res = await fetch(`http://192.168.1.4:5000/api/moods/${user.id || user._id}/latest`);
      const result = await res.json();
      if (result.success && result.data) {
        setUserMood(result.data.mood);
        
        // Get mood-based quote
        if (MotivationalQuotesService.hasMoodQuotes(result.data.mood)) {
          const quoteData = MotivationalQuotesService.getQuoteWithMetadata(result.data.mood);
          setMotivationalQuote(`" ${quoteData.quote}"`);
        } else {
          setMotivationalQuote('" Stay motivated and keep learning!"');
        }
      } else {
        setMotivationalQuote('" Log your mood to get personalized motivation!"');
      }
    } catch (error) {
      console.error('Error fetching mood:', error);
      setMotivationalQuote('" Stay positive and keep learning!"');
    }
  };

  const loadTodos = async () => {
    try {
      setLoading(true);
      const todos = await todoAPI.getAllTodos();
      setTasks(todos.map(todo => ({
        id: todo._id,
        text: todo.text,
        completed: todo.completed
      })));
    } catch (error) {
      console.error('Error loading todos:', error);
      Alert.alert('Error', 'Failed to load todos. Please check your connection.');
      // Keep some default tasks if API fails
      setTasks([
        { id: 'temp1', text: 'SE Group Assignment', completed: false },
        { id: 'temp2', text: 'Javascript Course', completed: false },
        { id: 'temp3', text: 'Report Making', completed: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const topics = [
    {
      id: 1,
      title: 'About',
      IconComponent: MaterialIcons,
      iconName: 'smart-toy',
      color: '#60a5fa',
      description: 'Learn about robots'
    },
    {
      id: 2,
      title: 'Reminder',
      IconComponent: MaterialIcons,
      iconName: 'event-note',
      color: '#f87171',
      description: 'Set reminders',
      customPadding: 30
    },
    {
      id: 3,
      title: 'Music',
      IconComponent: MaterialIcons,
      iconName: 'music-note',
      color: '#fb923c',
      description: 'Play music',
      customPadding: 30
    },
    {
      id: 4,
      title: 'Chatbot',
      IconComponent: MaterialIcons,
      iconName: 'chat-bubble-outline',
      color: '#facc15',
      description: 'Chat with AI'
    },
    {
      id: 5,
      title: 'Shop',
      IconComponent: MaterialIcons,
      iconName: 'storefront',
      color: '#4ade80',
      description: 'Shopping assistant'
    },
    {
      id: 6,
      title: 'Reviews',
      IconComponent: AntDesign,
      iconName: 'star',
      color: '#a78bfa',
      description: 'Rate and review',
      customPadding: 30
    }
  ];

  const handleTopicSelect = (topic) => {
    console.log(`Selected topic: ${topic.title}`);
    
    // Navigate to specific screens based on topic
    if (topic.title === 'About') {
      navigation.navigate('About');
    } else if (topic.title === 'Reminder') {
      navigation.navigate('Reminder');
    } else if (topic.title === 'Reviews') {
      navigation.navigate('Reviews');
    } else if (topic.title === 'Chatbot') {
      navigation.navigate('Chat');
    } else if (topic.title === 'Music') {
      navigation.navigate('Music');
    }
    // Add more navigation logic for other topics as needed
  };

  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const todoData = {
          text: newTask.trim(),
          category: 'general',
          priority: 'medium'
        };
        
        const newTodo = await todoAPI.createTodo(todoData);
        
        setTasks([...tasks, {
          id: newTodo._id,
          text: newTodo.text,
          completed: newTodo.completed
        }]);
        setNewTask('');
      } catch (error) {
        console.error('Error adding task:', error);
        Alert.alert('Error', 'Failed to add task. Please try again.');
      }
    }
  };

  const toggleTask = async (id) => {
  const handleEditTask = (task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const handleSaveEdit = async () => {
    if (!editingText.trim()) return;
    try {
      const updatedTodo = await todoAPI.updateTodo(editingTaskId, { text: editingText });
      setTasks(tasks.map(task =>
        task.id === editingTaskId ? { ...task, text: updatedTodo.text } : task
      ));
      setEditingTaskId(null);
      setEditingText('');
    } catch (error) {
      Alert.alert('Error', 'Failed to edit task.');
    }
  };

  const handleDeleteTask = (id) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await todoAPI.deleteTodo(id);
              setTasks(tasks.filter(task => task.id !== id));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task.');
            }
          }
        }
      ]
    );
  };
    try {
      const updatedTodo = await todoAPI.toggleTodo(id);
      
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: updatedTodo.completed } : task
      ));
    } catch (error) {
      console.error('Error toggling task:', error);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'Completed') return task.completed;
    if (filter === 'Progress') return !task.completed; // Show tasks that are not completed (in progress)
    return true; // 'All'
  });

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>What brings you to the</Text>
            <Text style={styles.appNameText}>ORION ROBOT APP ?</Text>
          </View>
          <TouchableOpacity style={styles.notificationIcon} onPress={() => navigation.navigate('Notification')}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Topics Grid */}
        <View style={styles.topicsGrid}>
          {topics.map((topic) => {
            const { IconComponent, iconName } = topic;
            return (
              <TouchableOpacity
                key={topic.id}
                style={[styles.topicCard, { backgroundColor: topic.color }]}
                onPress={() => handleTopicSelect(topic)}
              >
                <IconComponent 
                  name={iconName} 
                  size={28} 
                  color="white" 
                  style={styles.topicIcon}
                />
                <Text style={styles.topicTitle}>{topic.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notification Section */}
        <View style={styles.notificationSection}>
          <Text style={styles.sectionTitle}>Notification</Text>
        </View>

        {/* Motivational Quote */}
        <View style={styles.quoteSection}>
          <Text style={styles.quote}>{motivationalQuote}</Text>
        </View>

        {/* Todos Section */}
        <View style={styles.todosSection}>
          <Text style={styles.sectionTitle}>Todos</Text>
          
          {/* Add Task Input */}
          <View style={styles.addTaskContainer}>
            <TextInput
              style={styles.taskInput}
              placeholder="Add Task . . ."
              value={newTask}
              onChangeText={setNewTask}
              onSubmitEditing={addTask}
            />
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <Ionicons name="add" size={20} color="black" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            {['All', 'Completed', 'Progress'].map((filterOption) => (
              <TouchableOpacity
                key={filterOption}
                style={[
                  styles.filterButton,
                  filter === filterOption && styles.activeFilterButton
                ]}
                onPress={() => setFilter(filterOption)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filter === filterOption && styles.activeFilterButtonText
                ]}>
                  {filterOption}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Task List */}
          <View style={styles.taskList}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading todos...</Text>
              </View>
            ) : filteredTasks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {filter === 'All' ? 'No todos yet. Add your first task!' : 
                   filter === 'Completed' ? 'No completed tasks yet.' : 
                   'No tasks in progress.'}
                </Text>
              </View>
            ) : (
              filteredTasks.map((task) => (
                <View key={task.id} style={styles.taskItemRow}>
                  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                      style={styles.taskItem}
                      onPress={() => toggleTask(task.id)}
                    >
                      <View style={styles.taskCheckbox}>
                        {task.completed ? (
                          <Ionicons name="checkmark" size={16} color="green" />
                        ) : (
                          <View style={styles.emptyCheckbox} />
                        )}
                      </View>
                      {editingTaskId === task.id ? (
                        <TextInput
                          style={[styles.taskText, styles.editInput]}
                          value={editingText}
                          onChangeText={setEditingText}
                          onSubmitEditing={handleSaveEdit}
                          autoFocus
                        />
                      ) : (
                        <Text style={[styles.taskText, task.completed && styles.completedTaskText]}>
                          {task.text}
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                  <View style={styles.taskActions}>
                    {editingTaskId === task.id ? (
                      <TouchableOpacity onPress={handleSaveEdit} style={styles.actionButton}>
                        <Ionicons name="checkmark" size={18} color="#007AFF" />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => handleEditTask(task)} style={styles.actionButton}>
                        <Ionicons name="pencil" size={18} color="#666" />
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => handleDeleteTask(task.id)} style={styles.actionButton}>
                      <Ionicons name="trash" size={18} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentScreen="Home" />
    </View>
  );
}

const styles = StyleSheet.create({
  addTaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    marginHorizontal: 8,
  },
  taskList: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  taskItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 0,
    minHeight: 48,
    justifyContent: 'space-between',
    gap: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginHorizontal: 8,
    width: '100%',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 40,
    marginLeft: 'auto',
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    height: 40,
    width: 40,
  },
  editInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 15,
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTextContainer: {
    flex: 1,
  },
  notificationIcon: {
    padding: 8,
    marginTop: 4,
  },
  headerText: {
    textAlign: 'left',
    color: '#6b7280',
    marginBottom: 8,
    fontSize: 19,
  },
  appNameText: {
    textAlign: 'left',
    fontSize: 23,
    fontWeight: 'bold',
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  topicCard: {
    width: '31%', // Changed from 48% to 31% to fit 3 cards per row
    borderRadius: 16,
    paddingVertical: 24, // Reduced padding to fit smaller cards
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicIcon: {
    marginBottom: 6, // Reduced margin
  },
  topicTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14, // Reduced font size to fit in smaller cards
  },
  notificationSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  quoteSection: {
    backgroundColor: '#f3f4f6',
    marginHorizontal: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#4b5563',
    textAlign: 'center',
  },
  todosSection: {
    paddingHorizontal: 24,
    marginBottom: 80,
  },
  addTaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  taskInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    fontSize: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f3f4f6',
  },
  activeFilterButton: {
    backgroundColor: 'black',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  taskList: {
    marginTop: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  taskCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emptyCheckbox: {
    width: 12,
    height: 12,
    backgroundColor: 'transparent',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});