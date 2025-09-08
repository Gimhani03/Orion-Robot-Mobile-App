const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Review Content
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    trim: true,
    maxlength: [1000, 'Content cannot exceed 1000 characters']
  },
  
  // Rating
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  // User Information
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  
  // Author name (for display purposes)
  author: {
    type: String,
    trim: true,
    maxlength: [50, 'Author name cannot exceed 50 characters']
  },
  
  // Review Category
  category: {
    type: String,
    enum: ['robot', 'app', 'feature', 'support', 'general'],
    default: 'general'
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Moderation
  isApproved: {
    type: Boolean,
    default: true
  },
  
  // Helpful votes
  helpfulVotes: {
    type: Number,
    default: 0
  },
  
  // Users who found this review helpful
  helpfulBy: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate for user details
reviewSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'user',
  foreignField: '_id',
  justOne: true
});

// Index for performance
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ category: 1 });

// Pre-populate middleware
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name profileImage createdAt'
  });
  next();
});

module.exports = mongoose.model('Review', reviewSchema);
