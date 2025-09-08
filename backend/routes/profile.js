const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload only images'), false);
    }
  }
});

// All routes are protected
router.use(protect);

// @desc    Upload profile image
// @route   POST /api/profile/upload-image
// @access  Private
router.post('/upload-image', upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image to upload'
      });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Delete existing image from cloudinary if exists
    if (user.profileImage && user.profileImage.public_id) {
      try {
        await deleteFromCloudinary(user.profileImage.public_id);
      } catch (error) {
        console.log('Error deleting old image:', error.message);
      }
    }
    
    // Upload new image to cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'orion-robot-app/profiles',
      public_id: `user_${user._id}_${Date.now()}`,
      transformation: [
        { width: 400, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ]
    });
    
    // Update user profile with new image
    user.profileImage = {
      public_id: result.public_id,
      url: result.secure_url
    };
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        profileImage: user.profileImage
      }
    });
    
  } catch (error) {
    console.error('Upload image error:', error);
    
    if (error.message === 'Please upload only images') {
      return res.status(400).json({
        success: false,
        message: 'Please upload only images'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error uploading image'
    });
  }
});

// @desc    Delete profile image
// @route   DELETE /api/profile/delete-image
// @access  Private
router.delete('/delete-image', async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (!user.profileImage || !user.profileImage.public_id) {
      return res.status(400).json({
        success: false,
        message: 'No profile image to delete'
      });
    }
    
    // Delete image from cloudinary
    try {
      await deleteFromCloudinary(user.profileImage.public_id);
    } catch (error) {
      console.log('Error deleting image from cloudinary:', error.message);
    }
    
    // Remove image from user profile
    user.profileImage = undefined;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile image deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting image'
    });
  }
});

// @desc    Update profile with image
// @route   PATCH /api/profile/update
// @access  Private
router.patch('/update', upload.single('profileImage'), async (req, res) => {
  try {
    const { name, phone, bio, location } = req.body;
    
    const user = await User.findById(req.user._id); // Fixed: using _id instead of id
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update text fields
    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone ? phone.trim() : '';
    if (bio !== undefined) user.bio = bio ? bio.trim() : '';
    if (location !== undefined) user.location = location ? location.trim() : '';
    
    // Handle image upload if provided
    if (req.file) {
      // Delete existing image if exists
      if (user.profileImage && user.profileImage.public_id) {
        try {
          await deleteFromCloudinary(user.profileImage.public_id);
        } catch (error) {
          console.log('Error deleting old image:', error.message);
        }
      }
      
      // Upload new image
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'orion-robot-app/profiles',
        public_id: `user_${user._id}_${Date.now()}`,
        transformation: [
          { width: 400, height: 400, crop: 'fill' },
          { quality: 'auto' }
        ]
      });
      
      user.profileImage = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }
    
    await user.save();
    
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

module.exports = router;
