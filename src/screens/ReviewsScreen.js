import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { reviewsAPI } from '../config/api';
import BottomNavigation from '../components/BottomNavigation';

export default function ReviewsScreen({ navigation }) {
  const [reviews, setReviews] = useState([
    // Fallback data in case backend fails
    {
      _id: '1',
      title: 'Great Learning Experience',
      content: 'The robot lessons are very interactive and engaging. My child loves learning with Orion!',
      rating: 5,
      author: 'Sarah Johnson',
      createdAt: '2025-08-05',
    },
    {
      _id: '2',
      title: 'Excellent Educational Tool',
      content: 'Perfect for STEM education. The programming concepts are explained in a fun way.',
      rating: 4,
      author: 'Mike Chen',
      createdAt: '2025-08-03',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    rating: 5,
    author: '',
  });

  // Load reviews from backend when component mounts
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      console.log('🔄 Loading reviews from backend...');
      
      const response = await reviewsAPI.getAllReviews();
      
      if (response.success && response.data) {
        console.log('✅ Reviews loaded from backend:', response.data.length);
        setReviews(response.data);
        setBackendConnected(true);
      }
    } catch (error) {
      console.log('⚠️ Backend not available, using local data:', error.message);
      
      // Check if it's an authentication error
      if (error.message.includes('401') || error.message.includes('Not authorized')) {
        console.log('🔐 Authentication required - using local data for now');
      }
      
      setBackendConnected(false);
      // Keep using the fallback data that's already set
    } finally {
      setIsLoading(false);
    }
  };
  const openAddModal = () => {
    setEditingReview(null);
    setFormData({
      title: '',
      content: '',
      rating: 5,
      author: '',
    });
    setModalVisible(true);
  };

  const openEditModal = (review) => {
    setEditingReview(review);
    setFormData({
      title: review.title,
      content: review.content,
      rating: review.rating,
      author: review.author,
    });
    setModalVisible(true);
  };

  const handleSaveReview = async () => {
    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    const currentDate = new Date().toISOString().split('T')[0];

    try {
      if (editingReview) {
        // Update existing review
        const updateData = {
          title: formData.title,
          content: formData.content,
          rating: formData.rating,
          author: formData.author, // Include author field
          category: 'general'
        };

        if (backendConnected) {
          console.log('🔄 Updating review via backend...');
          
          // Check if this is a local review (timestamp ID) or backend review (ObjectId)
          const isLocalReview = /^\d+$/.test(editingReview._id); // Timestamp IDs are numeric
          
          if (isLocalReview) {
            console.log('📱 This is a local review, creating new one in backend...');
            // This is a local review, create it in backend instead of updating
            const response = await reviewsAPI.createReview(updateData);
            
            if (response.success && response.data) {
              console.log('✅ Local review created in backend');
              // Replace local review with backend review
              setReviews(reviews.map(review => 
                review._id === editingReview._id 
                  ? response.data // Use the new backend review
                  : review
              ));
            }
          } else {
            console.log('🔄 Updating existing backend review...');
            // This is a backend review, update it normally
            const response = await reviewsAPI.updateReview(editingReview._id, updateData);
            
            if (response.success) {
              console.log('✅ Review updated via backend');
              // Update local state with backend response
              setReviews(reviews.map(review => 
                review._id === editingReview._id 
                  ? { ...review, ...formData, updatedAt: currentDate }
                  : review
              ));
            }
          }
        } else {
          // Fallback to local update
          console.log('📱 Updating review locally');
          setReviews(reviews.map(review => 
            review._id === editingReview._id 
              ? { ...review, ...formData, updatedAt: currentDate }
              : review
          ));
        }
      } else {
        // Add new review
        const newReviewData = {
          title: formData.title,
          content: formData.content,
          rating: formData.rating,
          author: formData.author, // Include author field
          category: 'general' // Default category
        };

        if (backendConnected) {
          console.log('🔄 Creating review via backend...');
          const response = await reviewsAPI.createReview(newReviewData);
          
          if (response.success && response.data) {
            console.log('✅ Review created via backend');
            // Add backend response to local state
            setReviews([response.data, ...reviews]);
          }
        } else {
          // Fallback to local addition
          console.log('📱 Adding review locally');
          const newReview = {
            _id: Date.now().toString(),
            ...formData,
            createdAt: currentDate,
          };
          setReviews([newReview, ...reviews]);
        }
      }

      setModalVisible(false);
      setFormData({
        title: '',
        content: '',
        rating: 5,
        author: '',
      });
    } catch (error) {
      console.log('⚠️ Backend save failed, using local fallback:', error.message);
      
      // Fallback to local save
      if (editingReview) {
        setReviews(reviews.map(review => 
          review._id === editingReview._id 
            ? { ...review, ...formData, updatedAt: currentDate }
            : review
        ));
      } else {
        const newReview = {
          _id: Date.now().toString(),
          ...formData,
          createdAt: currentDate,
        };
        setReviews([newReview, ...reviews]);
      }
      
      setModalVisible(false);
      setFormData({
        title: '',
        content: '',
        rating: 5,
        author: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReview = (reviewId) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteReview(reviewId)
        },
      ]
    );
  };

  const deleteReview = async (reviewId) => {
    try {
      setIsLoading(true);
      
      // Check if this is a backend review (ObjectId format) or local review (timestamp)
      const isBackendReview = /^[0-9a-fA-F]{24}$/.test(reviewId);
      
      if (isBackendReview && backendConnected) {
        console.log('🔄 Deleting backend review via API...');
        const response = await reviewsAPI.deleteReview(reviewId);
        
        if (response.success) {
          console.log('✅ Backend review deleted successfully');
        }
      } else {
        console.log('📱 Deleting local review (or backend not connected)');
      }
      
      // Update local state regardless of backend result
      setReviews(reviews.filter(review => review._id !== reviewId));
      
    } catch (error) {
      console.log('⚠️ Backend delete failed, removing locally:', error.message);
      // Still remove from local state even if backend fails
      setReviews(reviews.filter(review => review._id !== reviewId));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating, onPress = null) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => onPress && onPress(star)}
            disabled={!onPress}
          >
            <Ionicons
              name={star <= rating ? 'star' : 'star-outline'}
              size={20}
              color={star <= rating ? '#FFD700' : '#ccc'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
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
        <Text style={styles.headerTitle}>Reviews</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={openAddModal}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <Text style={styles.totalReviews}>{reviews.length} Reviews</Text>
          <View style={styles.averageRating}>
            <Text style={styles.averageText}>
              {reviews.length > 0 
                ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
                : '0.0'
              }
            </Text>
            {renderStars(Math.round(reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length))}
          </View>
        </View>

        <ScrollView style={styles.reviewsList} showsVerticalScrollIndicator={false}>
          {reviews.map((review) => (
              <View key={review._id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewInfo}>
                    <Text style={styles.reviewTitle}>{review.title}</Text>
                    <View style={styles.ratingContainer}>
                      {renderStars(review.rating)}
                      <Text style={styles.ratingText}>({review.rating}/5)</Text>
                    </View>
                  </View>
                  <View style={styles.reviewActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => openEditModal(review)}
                    >
                      <Ionicons name="pencil" size={18} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeleteReview(review._id)}
                    >
                      <Ionicons name="trash" size={18} color="#ff4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text style={styles.reviewContent}>{review.content}</Text>

                <View style={styles.reviewFooter}>
                  <Text style={styles.authorName}>- {review.author}</Text>
                  <Text style={styles.reviewDate}>{formatDate(review.createdAt || review.date)}</Text>
                </View>
              </View>
            ))}

            {reviews.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={64} color="#ccc" />
                <Text style={styles.emptyTitle}>No Reviews Yet</Text>
                <Text style={styles.emptySubtitle}>Be the first to add a review!</Text>
                <TouchableOpacity style={styles.addFirstButton} onPress={openAddModal}>
                  <Text style={styles.addFirstButtonText}>Add Your First Review</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
      </View>

      {/* Add/Edit Review Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingReview ? 'Edit Review' : 'Add Review'}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={formData.title}
                  onChangeText={(text) => setFormData({...formData, title: text})}
                  placeholder="Enter review title"
                  maxLength={100}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Rating</Text>
                {renderStars(formData.rating, (rating) => setFormData({...formData, rating}))}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Review</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.content}
                  onChangeText={(text) => setFormData({...formData, content: text})}
                  placeholder="Write your review here..."
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  maxLength={500}
                />
                <Text style={styles.charCount}>{formData.content.length}/500</Text>
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Your Name</Text>
                <TextInput
                  style={styles.input}
                  value={formData.author}
                  onChangeText={(text) => setFormData({...formData, author: text})}
                  placeholder="Enter your name"
                  maxLength={50}
                />
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveReview}
              >
                <Text style={styles.saveButtonText}>
                  {editingReview ? 'Update' : 'Save'} Review
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentScreen="Reviews" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
   
  },
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusContainer: {
    paddingHorizontal: 24,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  loadingText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  totalReviews: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  averageRating: {
    alignItems: 'center',
  },
  averageText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewsList: {
    flex: 1,
  },
  reviewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#000',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  reviewContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalForm: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    paddingTop: 10,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#000',
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  addFirstButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 15,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
