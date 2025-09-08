const express = require('express');
const Todo = require('../models/Todo');
const { protect } = require('../middleware/auth');
const router = express.Router();

// @route   GET /api/todos
// @desc    Get all todos for the authenticated user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id })
      .sort({ createdAt: -1 }); // Sort by newest first
    
    res.json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching todos'
    });
  }
});

// @route   GET /api/todos/stats
// @desc    Get todo statistics for the authenticated user
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const totalTodos = await Todo.countDocuments({ userId: req.user.id });
    const completedTodos = await Todo.countDocuments({ 
      userId: req.user.id, 
      completed: true 
    });
    const pendingTodos = totalTodos - completedTodos;
    
    // Get todos by priority
    const highPriorityTodos = await Todo.countDocuments({ 
      userId: req.user.id, 
      priority: 'high',
      completed: false 
    });
    
    // Get overdue todos
    const overdueTodos = await Todo.countDocuments({ 
      userId: req.user.id, 
      completed: false,
      dueDate: { $lt: new Date() }
    });
    
    res.json({
      success: true,
      data: {
        total: totalTodos,
        completed: completedTodos,
        pending: pendingTodos,
        highPriority: highPriorityTodos,
        overdue: overdueTodos,
        completionRate: totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching todo stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching todo statistics'
    });
  }
});

// @route   GET /api/todos/:id
// @desc    Get a specific todo by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    res.json({
      success: true,
      data: todo
    });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching todo'
    });
  }
});

// @route   POST /api/todos
// @desc    Create a new todo
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { text, priority, dueDate, category } = req.body;
    
    // Validation
    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Todo text is required'
      });
    }
    
    if (text.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Todo text cannot exceed 200 characters'
      });
    }
    
    const todoData = {
      text: text.trim(),
      userId: req.user.id,
      completed: false
    };
    
    // Add optional fields if provided
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      todoData.priority = priority;
    }
    
    if (dueDate) {
      todoData.dueDate = new Date(dueDate);
    }
    
    if (category && category.trim().length > 0) {
      todoData.category = category.trim();
    }
    
    const todo = new Todo(todoData);
    await todo.save();
    
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      data: todo
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating todo'
    });
  }
});

// @route   PUT /api/todos/:id
// @desc    Update a todo
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { text, completed, priority, dueDate, category } = req.body;
    
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    // Update fields if provided
    if (text !== undefined) {
      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Todo text cannot be empty'
        });
      }
      if (text.length > 200) {
        return res.status(400).json({
          success: false,
          message: 'Todo text cannot exceed 200 characters'
        });
      }
      todo.text = text.trim();
    }
    
    if (completed !== undefined) {
      todo.completed = completed;
    }
    
    if (priority !== undefined && ['low', 'medium', 'high'].includes(priority)) {
      todo.priority = priority;
    }
    
    if (dueDate !== undefined) {
      todo.dueDate = dueDate ? new Date(dueDate) : null;
    }
    
    if (category !== undefined) {
      todo.category = category ? category.trim() : 'general';
    }
    
    await todo.save();
    
    res.json({
      success: true,
      message: 'Todo updated successfully',
      data: todo
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating todo'
    });
  }
});

// @route   PATCH /api/todos/:id/toggle
// @desc    Toggle todo completion status
// @access  Private
router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    todo.completed = !todo.completed;
    await todo.save();
    
    res.json({
      success: true,
      message: `Todo marked as ${todo.completed ? 'completed' : 'incomplete'}`,
      data: todo
    });
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while toggling todo'
    });
  }
});

// @route   DELETE /api/todos/:id
// @desc    Delete a todo
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    
    await Todo.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Todo deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting todo'
    });
  }
});

// @route   DELETE /api/todos/completed
// @desc    Delete all completed todos for the authenticated user
// @access  Private
router.delete('/completed', protect, async (req, res) => {
  try {
    const result = await Todo.deleteMany({ 
      userId: req.user.id, 
      completed: true 
    });
    
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} completed todos`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting completed todos:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting completed todos'
    });
  }
});

module.exports = router;
