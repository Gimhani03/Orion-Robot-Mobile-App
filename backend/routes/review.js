const express = require('express');
const Review = require('../models/Review');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Temporarily disabled for gradual integration - TODO: Re-enable authentication later
// router.use(protect);

// Mock user middleware for testing without authentication
const mockUser = (req, res, next) => {
  if (!req.user) {
    // Create a mock user for testing with proper ObjectId from existing user
    const mongoose = require('mongoose');
    req.user = {
      _id: new mongoose.Types.ObjectId('68a02990a73d3b6556ce084d'), // Existing user ID
      email: 'test@example.com',
      name: 'Test User'
    };
  }
  next();
};

// @desc    Get all reviews with pagination
// @route   GET /api/reviews
// @access  Private
router.get('/', mockUser, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { category, rating, sort } = req.query;
    
    console.log('📖 === GET REVIEWS REQUEST ===');
    console.log('👤 User:', req.user.email);
    console.log('📊 Query params:', { page, limit, category, rating, sort });
    
    // Build filter object
    const filter = { isActive: true, isApproved: true };
    if (category) filter.category = category;
    if (rating) filter.rating = parseInt(rating);
    
    console.log('🔍 Filter applied:', filter);
    
    // Build sort object
    let sortObj = { createdAt: -1 }; // Default: newest first
    if (sort === 'rating_high') sortObj = { rating: -1, createdAt: -1 };
    if (sort === 'rating_low') sortObj = { rating: 1, createdAt: -1 };
    if (sort === 'helpful') sortObj = { helpfulVotes: -1, createdAt: -1 };
    
    console.log('📑 Sort applied:', sortObj);
    
    const reviews = await Review.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .populate('user', 'name profileImage');
    
    const total = await Review.countDocuments(filter);
    
    console.log(`✅ Found ${reviews.length} reviews out of ${total} total`);
    
    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('❌ Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews'
    });
  }
});

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
router.post('/', mockUser, async (req, res) => {
  try {
    const { title, content, rating, category, author } = req.body;
    
    console.log('📝 === NEW REVIEW CREATION ===');
    console.log('👤 User:', req.user.email);
    console.log('📊 Review data:', { title: title || 'MISSING', content: content ? 'PROVIDED' : 'MISSING', rating, category, author });
    
    // Validation
    if (!title || !content || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content, and rating'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Create review
    console.log('🔧 Creating review with data:', {
      title,
      content,
      rating,
      category: category || 'general',
      author: author || req.user.name || 'Anonymous',
      user: req.user._id
    });
    
    const review = await Review.create({
      title,
      content,
      rating,
      category: category || 'general',
      author: author || req.user.name || 'Anonymous',
      user: req.user._id
    });

    console.log('✅ Review created successfully:', review._id);

    // Try to populate user data for response (but don't fail if user doesn't exist)
    try {
      await review.populate('user', 'name profileImage');
    } catch (populateError) {
      console.log('⚠️ Could not populate user data:', populateError.message);
    }

    res.status(201).json({
      success: true,
      data: review
    });

  } catch (error) {
    console.error('❌ Create review error:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update a review
// @route   PATCH /api/reviews/:id
// @access  Private
router.patch('/:id', mockUser, async (req, res) => {
  try {
    console.log('✏️ === UPDATE REVIEW ===');
    console.log('👤 User:', req.user.email);
    console.log('🆔 Review ID:', req.params.id);
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review (temporarily disabled for testing)
    // if (review.user.toString() !== req.user._id.toString()) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Not authorized to update this review'
    //   });
    // }

    // Update fields
    const { title, content, rating, category, author } = req.body;
    
    if (title) review.title = title;
    if (content) review.content = content;
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5'
        });
      }
      review.rating = rating;
    }
    if (category) review.category = category;
    if (author) review.author = author;
    
    review.updatedAt = Date.now();
    
    await review.save();
    await review.populate('user', 'name profileImage');

    console.log('✅ Review updated successfully');

    res.status(200).json({
      success: true,
      data: review
    });

  } catch (error) {
    console.error('❌ Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review'
    });
  }
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', mockUser, async (req, res) => {
  try {
    console.log('🗑️ === DELETE REVIEW ===');
    console.log('👤 User:', req.user.email);
    console.log('🆔 Review ID:', req.params.id);
    
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review (temporarily disabled for testing)
    // if (review.user.toString() !== req.user._id.toString()) {
    //   return res.status(401).json({
    //     success: false,
    //     message: 'Not authorized to delete this review'
    //   });
    // }

    await Review.findByIdAndDelete(req.params.id);

    console.log('✅ Review deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review'
    });
  }
});

module.exports = router;
