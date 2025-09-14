import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../config/api';
import BottomNavigation from '../components/BottomNavigation';

export default function ProfileScreen({ navigation }) {
  const { profileImage, profileData, updateProfileImage, updateProfileData, clearProfileData } = useProfile();
  const { user, updateUser, token } = useAuth(); // Get token for API calls
  
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Live validation for password match
  const passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;
  const showValidationIcon = confirmPassword.length > 0;

  // Debug profile image state
  useEffect(() => {
    console.log('🔍 === PROFILE IMAGE DEBUG ===');
    console.log('🔍 Current profile image:', profileImage);
    console.log('🔍 Profile image type:', typeof profileImage);
    console.log('🔍 Profile image length:', profileImage?.length);
    console.log('🔍 Is valid URL format:', profileImage && (profileImage.startsWith('http') || profileImage.startsWith('file')));
    console.log('🔍 Is local asset test:', profileImage === 'LOCAL_ASSET_TEST');
    console.log('🔍 Is permanent storage path:', profileImage && profileImage.includes('profile_images/'));
    console.log('🔍 Document directory:', FileSystem.documentDirectory);
    console.log('🔍 =====================');
  }, [profileImage]);

  // Test network connectivity
  const testNetworkConnectivity = async () => {
    try {
      console.log('🌐 Testing network connectivity...');
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        timeout: 5000 
      });
      console.log('✅ Network connectivity: OK', response.status);
      return true;
    } catch (error) {
      console.log('❌ Network connectivity: FAILED', error.message);
      return false;
    }
  };

  // Copy image to permanent storage
  const copyImageToPermanentStorage = async (imageUri) => {
    try {
      console.log('📁 === COPYING IMAGE TO PERMANENT STORAGE ===');
      console.log('📂 Source URI:', imageUri);
      
      // Create a permanent directory for profile images
      const profileImagesDir = `${FileSystem.documentDirectory}profile_images/`;
      console.log('📁 Target directory:', profileImagesDir);
      
      // Ensure the directory exists
      const dirInfo = await FileSystem.getInfoAsync(profileImagesDir);
      if (!dirInfo.exists) {
        console.log('📁 Creating profile images directory...');
        await FileSystem.makeDirectoryAsync(profileImagesDir, { intermediates: true });
      }
      
      // Generate a unique filename
      const fileExtension = imageUri.split('.').pop() || 'jpg';
      const fileName = `profile_${Date.now()}.${fileExtension}`;
      const permanentUri = `${profileImagesDir}${fileName}`;
      
      console.log('📄 Target filename:', fileName);
      console.log('📍 Permanent URI:', permanentUri);
      
      // Copy the file
      await FileSystem.copyAsync({
        from: imageUri,
        to: permanentUri
      });
      
      console.log('✅ Image copied successfully to permanent storage');
      
      // Verify the copy worked
      const fileInfo = await FileSystem.getInfoAsync(permanentUri);
      if (fileInfo.exists) {
        console.log('✅ File verification passed:', {
          size: fileInfo.size,
          uri: permanentUri
        });
        return permanentUri;
      } else {
        throw new Error('File copy verification failed');
      }
      
    } catch (error) {
      console.error('❌ Failed to copy image to permanent storage:', error);
      console.error('❌ Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      throw error;
    }
  };

  // Clean up old profile images (keep only the current one)
  const cleanupOldProfileImages = async () => {
    try {
      console.log('🧹 === CLEANING UP OLD PROFILE IMAGES ===');
      const profileImagesDir = `${FileSystem.documentDirectory}profile_images/`;
      
      const dirInfo = await FileSystem.getInfoAsync(profileImagesDir);
      if (!dirInfo.exists) {
        console.log('📁 Profile images directory does not exist, nothing to clean');
        return;
      }
      
      const files = await FileSystem.readDirectoryAsync(profileImagesDir);
      console.log('📄 Found files:', files);
      
      // Get current profile image filename
      const currentImageFilename = profileImage ? profileImage.split('/').pop() : null;
      console.log('📸 Current profile image filename:', currentImageFilename);
      
      let deletedCount = 0;
      for (const file of files) {
        if (file !== currentImageFilename) {
          const filePath = `${profileImagesDir}${file}`;
          await FileSystem.deleteAsync(filePath);
          console.log('🗑️ Deleted old file:', file);
          deletedCount++;
        }
      }
      
      console.log(`✅ Cleanup complete: ${deletedCount} old files deleted`);
      
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
  };
  
  // Create profile data from authenticated user only (no hardcoded defaults)
  const getProfileData = () => ({
    name: user?.name || '',
    email: user?.email || '',
    phone: '', // Start empty, will be loaded from backend
    bio: '', // Start empty, will be loaded from backend
    location: '', // Start empty, will be loaded from backend
    joinDate: user?.joinDate ? new Date(user.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });
  
  const [localProfileData, setLocalProfileData] = useState(getProfileData());
  const [editData, setEditData] = useState(getProfileData());

  // Simple effect to update data when user changes (only run when user actually changes)
  useEffect(() => {
    if (user) {
      const newData = getProfileData();
      setLocalProfileData(newData);
      setEditData(newData);
    } else {
      // User logged out - clear all profile data
      console.log('👤 User logged out - clearing profile data');
      clearProfileData();
      setLocalProfileData(getProfileData());
      setEditData(getProfileData());
    }
  }, [user?.id]); // Only depend on user ID to prevent infinite loops

  // Load profile data from backend when component mounts
  useEffect(() => {
    const loadProfileData = async () => {
      if (token && user) {
        try {
          console.log('📊 === LOAD PROFILE DATA TRIGGERED ===');
          console.log('🔐 Token available:', token ? 'YES' : 'NO');
          console.log('👤 User ID:', user?.id);
          console.log('🎯 Is editing:', isEditing);
          console.log('📝 Current localProfileData before load:', JSON.stringify(localProfileData, null, 2));
          
          const response = await userAPI.getProfile(token);
          
          console.log('📦 Backend load response:', JSON.stringify(response, null, 2));
          
          if (response.success && response.data?.user) {
            const backendUser = response.data.user;
            
            // Use backend data as the primary source, with minimal fallbacks
            const mergedData = {
              name: backendUser.name,
              email: backendUser.email,
              phone: backendUser.phone || '', // Empty string instead of hardcoded fallback
              bio: backendUser.bio || '', // Empty string instead of hardcoded fallback
              location: backendUser.location || '', // Empty string instead of hardcoded fallback
              joinDate: backendUser.joinDate ? new Date(backendUser.joinDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            };
            
            // Load profile image if available
            if (backendUser.profileImage && backendUser.profileImage.url) {
              console.log('📸 Loading profile image from backend:', backendUser.profileImage.url);
              updateProfileImage(backendUser.profileImage.url);
            } else {
              console.log('� No profile image found in backend');
              // Don't clear existing image unless explicitly removed
            }
            
            console.log('�📋 Backend profile data loaded:', {
              phone: backendUser.phone,
              bio: backendUser.bio,
              location: backendUser.location,
              profileImage: backendUser.profileImage?.url || 'None',
              isUndefined: {
                phone: backendUser.phone === undefined,
                bio: backendUser.bio === undefined,
                location: backendUser.location === undefined
              }
            });
            
            console.log('📊 Merged data to apply:', JSON.stringify(mergedData, null, 2));
            
            // Don't override if we're currently editing
            if (!isEditing) {
              console.log('✅ Applying loaded data to state (not editing)');
              setLocalProfileData(mergedData);
              setEditData(mergedData);
              updateProfileData(mergedData);
              console.log('✅ Profile data loaded and applied to state');
            } else {
              console.log('⏸️ SKIPPING profile data update - currently editing');
              console.log('📝 Edit data preserved:', JSON.stringify(editData, null, 2));
            }
          } else {
            console.log('❌ Invalid response structure:', response);
          }
        } catch (error) {
          console.error('❌ Failed to load profile data:', error);
          // Don't show error to user, just use local data
        }
      } else {
        console.log('⏳ Waiting for token and user...', { 
          tokenAvailable: !!token, 
          userAvailable: !!user 
        });
      }
    };

    // Add a small delay to prevent race conditions with save operations
    const timeoutId = setTimeout(() => {
      console.log('🕐 Delayed profile data load executing...');
      loadProfileData();
    }, 100);
    
    return () => {
      console.log('🧹 Cleanup: clearing profile load timeout');
      clearTimeout(timeoutId);
    };
  }, [token, user?.id, isEditing]); // Added isEditing to dependencies

  const pickImage = async () => {
    try {
      // Request permission to access media library
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert(
          'Permission Required', 
          'Permission to access camera roll is required!',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => console.log('Open Settings') }
          ]
        );
        return;
      }

      // Show options for camera, gallery, or delete
      const alertOptions = [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' }
      ];

      // Add delete option if profile image exists
      if (profileImage) {
        alertOptions.splice(2, 0, { 
          text: 'Remove Picture', 
          onPress: () => removeProfileImage(),
          style: 'destructive'
        });
      }

      Alert.alert(
        'Select Profile Picture',
        'Choose an option',
        alertOptions
      );
    } catch (error) {
      console.error('Error requesting permissions:', error);
      Alert.alert('Error', 'Failed to request permissions. Please try again.');
    }
  };

  const openCamera = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera is required!');
        return;
      }

      console.log('📷 Opening camera...');
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('📷 Camera result:', result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const tempUri = result.assets[0].uri;
        console.log('📸 Temporary image URI from camera:', tempUri);
        
        try {
          // Copy to permanent storage
          const permanentUri = await copyImageToPermanentStorage(tempUri);
          console.log('📁 Permanent URI created:', permanentUri);
          
          // Update profile image with permanent URI
          updateProfileImage(permanentUri);
          console.log('✅ Profile image updated with permanent URI');
          
          // Auto-save profile image when selected
          if (!isEditing) {
            console.log('📸 Auto-saving profile image...');
            await saveProfileImage(permanentUri);
          }
        } catch (error) {
          console.error('❌ Failed to process camera image:', error);
          Alert.alert('Error', 'Failed to save image. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error opening camera:', error);
      Alert.alert('Error', 'Failed to open camera. Please try again.');
    }
  };

  const openGallery = async () => {
    try {
      console.log('🖼️ Opening gallery...');
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log('🖼️ Gallery result:', result);
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const tempUri = result.assets[0].uri;
        console.log('📸 Temporary image URI from gallery:', tempUri);
        
        try {
          // Copy to permanent storage
          const permanentUri = await copyImageToPermanentStorage(tempUri);
          console.log('📁 Permanent URI created:', permanentUri);
          
          // Update profile image with permanent URI
          updateProfileImage(permanentUri);
          console.log('✅ Profile image updated with permanent URI');
          
          // Auto-save profile image when selected
          if (!isEditing) {
            console.log('📸 Auto-saving profile image...');
            await saveProfileImage(permanentUri);
          }
        } catch (error) {
          console.error('❌ Failed to process gallery image:', error);
          Alert.alert('Error', 'Failed to save image. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert('Error', 'Failed to open gallery. Please try again.');
    }
  };

  const removeProfileImage = () => {
    Alert.alert(
      'Remove Profile Picture',
      'Are you sure you want to remove your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            updateProfileImage(null);
            console.log('Profile image removed');
            
            // Auto-save profile image removal
            await saveProfileImage(null);
          }
        }
      ]
    );
  };

  const saveProfileImage = async (imageUri) => {
    try {
      console.log('📸 === SAVE PROFILE IMAGE STARTED ===');
      console.log('🖼️ Image URI:', imageUri || 'REMOVING IMAGE');
      
      if (!token) {
        Alert.alert('Error', 'Please log in again');
        return;
      }

      const updateData = {
        phone: localProfileData.phone || '',
        bio: localProfileData.bio || '',
        location: localProfileData.location || '',
        profileImageUri: imageUri
      };

      const response = await userAPI.updateProfile(updateData, token);
      
      if (response.success) {
        console.log('✅ Profile image saved successfully!');
        Alert.alert('Success', 'Profile picture updated!');
        
        // Update the user data in AuthContext if available
        if (updateUser && response.data?.user) {
          updateUser(response.data.user);
        }
      } else {
        throw new Error(response.message || 'Failed to save profile image');
      }
    } catch (error) {
      console.error('❌ Error saving profile image:', error);
      Alert.alert('Error', 'Failed to save profile picture. Please try again.');
    }
  };

  const handleEdit = () => {
    setEditData({ ...localProfileData });
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      console.log('💾 === SAVE PROCESS STARTED ===');
      console.log('📝 Current editData:', JSON.stringify(editData, null, 2));
      console.log('📝 Current localProfileData:', JSON.stringify(localProfileData, null, 2));
      
      // Prepare data for backend (only editable fields)
      const updateData = {
        phone: editData.phone || '',
        bio: editData.bio || '',
        location: editData.location || '',
        profileImageUri: profileImage // Include profile image URI
      };

      console.log('🔄 Data being sent to backend:', JSON.stringify({
        ...updateData,
        profileImageUri: updateData.profileImageUri ? 'PROVIDED' : 'NOT PROVIDED'
      }, null, 2));
      console.log('🔐 Token available:', token ? 'YES' : 'NO');
      console.log('🔐 Token preview:', token ? token.substring(0, 20) + '...' : 'No token');
      
      // Call backend API to update profile
      console.log('📡 Making API call...');
      const response = await userAPI.updateProfile(updateData, token);
      
      console.log('💾 Raw API response:', JSON.stringify(response, null, 2));
      
      if (response.success) {
        console.log('✅ Backend save successful!');
        
        // Keep the name and email from authenticated user, merge with updated data
        const updatedData = {
          ...editData,
          name: localProfileData.name, // Ensure name stays the same
          email: localProfileData.email, // Ensure email stays the same
          phone: updateData.phone,
          bio: updateData.bio,
          location: updateData.location
        };

        console.log('📊 Final data to apply to state:', JSON.stringify(updatedData, null, 2));

        // Update local state and ProfileContext FIRST
        console.log('🔄 Updating local state...');
        setLocalProfileData(updatedData);
        console.log('🔄 Updating profile context...');
        updateProfileData(updatedData);
        
        // Update the authenticated user data with the backend response
        if (updateUser && response.data?.user) {
          console.log('🔄 Updating AuthContext with backend response...');
          console.log('Backend user data:', JSON.stringify(response.data.user, null, 2));
          await updateUser(response.data.user);
        }
        
        console.log('✅ All state updates completed');
        
        // Small delay before clearing editing state to prevent race conditions
        setTimeout(() => {
          setIsEditing(false);
          console.log('✅ Editing state cleared - save process complete');
        }, 200); // Increased delay
        
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        console.log('❌ Save failed - backend response:', response);
        Alert.alert('Error', response.message || 'Failed to update profile');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...localProfileData });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleChangePassword = () => {
    setPasswordError('');
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill all fields.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    // TODO: Call API to change password
    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    Alert.alert('Success', 'Password changed successfully!');
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
  {/* Add extra space below Log Out for visibility */}
  <View style={{ paddingBottom: 40 }} />
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={isEditing ? handleSave : handleEdit}
        >
          <Ionicons 
            name={isEditing ? "checkmark" : "pencil"} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
  <ScrollView style={[styles.content, {paddingBottom: 80}]} showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              {profileImage ? (
                <Image 
                  source={
                    profileImage === 'LOCAL_ASSET_TEST' 
                      ? require('../../assets/icon.png')
                      : { uri: profileImage }
                  } 
                  style={styles.profileImagePicture}
                  onError={(error) => {
                    console.error('❌ Profile image failed to load:', error);
                    console.error('📸 Failed image URI:', profileImage);
                    console.error('🔗 Error details:', error.nativeEvent);
                    // Clear the failed image to show fallback
                    updateProfileImage(null);
                  }}
                  onLoad={() => {
                    console.log('✅ Profile image loaded successfully:', profileImage);
                  }}
                  onLoadStart={() => {
                    console.log('🔄 Started loading profile image:', profileImage);
                  }}
                />
              ) : (
                <MaterialIcons name="person" size={80} color="#666" />
              )}
            </View>
            {isEditing && (
              <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.profileName}>{localProfileData.name}</Text>
          <Text style={styles.joinDate}>
            Member since {formatDate(localProfileData.joinDate)}
          </Text>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <Text style={styles.fieldValue}>{localProfileData.name}</Text>
            {isEditing && (
              <Text style={styles.fieldNote}>Name cannot be changed</Text>
            )}
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Email Address</Text>
            <Text style={styles.fieldValue}>{localProfileData.email}</Text>
            {isEditing && (
              <Text style={styles.fieldNote}>Email cannot be changed</Text>
            )}
          </View>

          {/* Phone Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Phone Number</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={editData.phone}
                onChangeText={(text) => setEditData({...editData, phone: text})}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                maxLength={20}
              />
            ) : (
              <Text style={styles.fieldValue}>{localProfileData.phone}</Text>
            )}
          </View>

          {/* Location Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Location</Text>
            {isEditing ? (
              <TextInput
                style={styles.textInput}
                value={editData.location}
                onChangeText={(text) => setEditData({...editData, location: text})}
                placeholder="Enter your location"
                maxLength={100}
              />
            ) : (
              <Text style={styles.fieldValue}>{localProfileData.location}</Text>
            )}
          </View>

          {/* Bio Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Bio</Text>
            {isEditing ? (
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                value={editData.bio}
                onChangeText={(text) => setEditData({...editData, bio: text})}
                placeholder="Tell us about yourself..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={200}
              />
            ) : (
              <Text style={styles.fieldValue}>{localProfileData.bio}</Text>
            )}
            {isEditing && (
              <Text style={styles.charCount}>{editData.bio.length}/200</Text>
            )}
          </View>
        </View>

        {/* Account Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <TouchableOpacity style={styles.settingItem} onPress={() => setShowChangePassword(true)}>
            <View style={styles.settingLeft}>
              <Ionicons name="lock-closed-outline" size={24} color="#666" />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications-outline" size={24} color="#666" />
              <Text style={styles.settingText}>Notification Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#666" />
              <Text style={styles.settingText}>Privacy Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
          {/* Log Out Option */}
          <TouchableOpacity style={[styles.settingItem, {marginBottom: 24}]} onPress={() => {
            Alert.alert(
              'Log Out',
              'Are you sure you want to log out?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Log Out', style: 'destructive', onPress: () => {
                    clearProfileData && clearProfileData();
                    updateUser && updateUser(null);
                    navigation.replace('SignIn');
                  }
                }
              ]
            );
          }}>
            <View style={styles.settingLeft}>
              <Ionicons name="exit-outline" size={24} color="#e11d48" />
              <Text style={[styles.settingText, { color: '#e11d48', fontWeight: 'bold' }]}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        visible={showChangePassword}
        animationType="slide"
        transparent
        onRequestClose={() => setShowChangePassword(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Current Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="New Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <View style={styles.inputWithIcon}>
              <TextInput
                style={[styles.modalInput, { flex: 1 }]}
                placeholder="Confirm New Password"
                placeholderTextColor="#888"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              {showValidationIcon && (
                passwordsMatch ? (
                  <Ionicons name="checkmark-circle" size={22} color="#22c55e" style={styles.inputIcon} />
                ) : (
                  <Ionicons name="close-circle" size={22} color="#ef4444" style={styles.inputIcon} />
                )
              )}
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowChangePassword(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNavigation navigation={navigation} currentScreen="Profile" />
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
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  profileImageSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  profileImagePicture: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: '#666',
  },
  detailsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  textInput: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
  },
  bioInput: {
    height: 100,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  settingsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginTop: 20,
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
  fieldNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  bottomSpacing: {
    height: 40,
  },
  debugContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },
  debugButton: {
    backgroundColor: '#4287f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  debugButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  modalInput: {
    height: 48,
    fontSize: 16,
    color: '#000',
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#000',
    marginBottom: 12,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
  },
  inputIcon: {
    position: 'absolute',
    right: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#e11d48',
    marginBottom: 12,
    textAlign: 'center',
  },
});
