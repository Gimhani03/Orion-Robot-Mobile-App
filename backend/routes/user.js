const express = require('express');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    console.log('📊 Profile fetch request for user:', req.user._id);
    console.log('👤 User email:', req.user.email);
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('📋 Raw user data from DB:', {
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      name: user.name,
      email: user.email
    });
    
    console.log('📋 Full profile data:', user.fullProfile);
    
    res.status(200).json({
      success: true,
      data: {
        user: user.fullProfile
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// @desc    Update user profile
// @route   PATCH /api/user/profile
// @access  Private
router.patch('/profile', async (req, res) => {
  try {
    console.log('🔍 RAW req.body:', req.body);
    console.log('🔍 req.body type:', typeof req.body);
    console.log('🔍 req.body keys:', Object.keys(req.body));
    console.log('🔍 Content-Type header:', req.headers['content-type']);
    
    const { phone, bio, location, profileImageUri } = req.body;
    
    console.log('🔄 Profile update request received:', { phone, bio, location, profileImageUri: profileImageUri ? 'PROVIDED' : 'NOT PROVIDED' });
    console.log('👤 User ID:', req.user._id);
    console.log('👤 User email:', req.user.email);
    
    // Build update object - name and email are not allowed to be updated
    const updateData = {};
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : '';
    if (bio !== undefined) updateData.bio = bio ? bio.trim() : '';
    if (location !== undefined) updateData.location = location ? location.trim() : '';
    
    // Handle profile image if provided
    if (profileImageUri !== undefined) {
      if (profileImageUri === null || profileImageUri === '') {
        // Remove profile image
        updateData.profileImage = { public_id: '', url: '' };
        console.log('🗑️ Profile image will be removed for user:', req.user.email);
      } else {
        // For now, store the URI directly (local file path)
        // In production, you'd upload to cloud storage here
        updateData.profileImage = { public_id: '', url: profileImageUri };
        console.log('📸 Profile image will be updated for user:', req.user.email);
        console.log('📸 Image URI preview:', profileImageUri.substring(0, 50) + '...');
      }
    }
    
    console.log('📝 Update data prepared:', updateData);
    
    // First, find the user to see current state
    const userBefore = await User.findById(req.user._id);
    console.log('📋 User BEFORE update:', {
      phone: userBefore ? userBefore.phone : 'USER NOT FOUND',
      bio: userBefore ? userBefore.bio : 'USER NOT FOUND',
      location: userBefore ? userBefore.location : 'USER NOT FOUND'
    });
    
    // Try using $set explicitly with the correct ID field
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false
      }
    );
    
    if (!user) {
      console.log('❌ User not found during update');
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('✅ User updated successfully');
    console.log('📋 Updated user profile:', {
      phone: user.phone,
      bio: user.bio,
      location: user.location
    });
    
    // Double-check by fetching again
    const userAfter = await User.findById(req.user._id);
    console.log('🔍 Verification fetch:', {
      phone: userAfter.phone,
      bio: userAfter.bio,
      location: userAfter.location
    });
    
    console.log('📊 Full profile response:', user.fullProfile);
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.fullProfile
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
});

// @desc    Delete user account
// @route   DELETE /api/user/account
// @access  Private
router.delete('/account', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your password to confirm account deletion'
      });
    }
    
    // Get user with password
    const user = await User.findById(req.user.id).select('+password');
    
    // Verify password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }
    
    // Soft delete - deactivate account instead of hard delete
    await User.findByIdAndUpdate(req.user.id, { 
      isActive: false,
      email: `deleted_${Date.now()}_${user.email}` // Prevent email conflicts
    });
    
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting account'
    });
  }
});

// @desc    Get user preferences
// @route   GET /api/user/preferences
// @access  Private
router.get('/preferences', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('preferences');
    
    res.status(200).json({
      success: true,
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching preferences'
    });
  }
});

// @desc    Update user preferences
// @route   PATCH /api/user/preferences
// @access  Private
router.patch('/preferences', async (req, res) => {
  try {
    const { notifications, theme } = req.body;
    
    const updateData = {};
    if (notifications) {
      updateData['preferences.notifications'] = notifications;
    }
    if (theme) {
      updateData['preferences.theme'] = theme;
    }
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).select('preferences');
    
    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences'
    });
  }
});

module.exports = router;
