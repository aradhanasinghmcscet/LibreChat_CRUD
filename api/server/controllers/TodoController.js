const { Todo } = require('~/models/todo');
const { logger } = require('@librechat/data-schemas');

/**
 * Create a new TODO
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createTodo = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const user = req.user._id;

    // Validate input
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (title.length > 100) {
      return res.status(400).json({ error: 'Title must be less than 100 characters' });
    }
    if (description && description.length > 500) {
      return res.status(400).json({ error: 'Description must be less than 500 characters' });
    }

    const todo = new Todo({
      title,
      description,
      status: status || 'pending',

    });

    const savedTodo = await todo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    logger.error('[createTodo] Error creating todo', error);
    res.status(500).json({ error: 'Error creating todo' });
  }
};

/**
 * Get all TODOs for a user with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTodos = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) {
      query.status = status;
    }

    const todos = await Todo.find(query)
      .sort({ createdAt: -1 })
      .lean();

    res.json(todos);
  } catch (error) {
    logger.error('[getTodos] Error fetching todos', error);
    res.status(500).json({ error: 'Error fetching todos' });
  }
};

/**
 * Update a TODO
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const user = req.user._id;

    // Validate input
    if (title && title.length > 100) {
      return res.status(400).json({ error: 'Title must be less than 100 characters' });
    }
    if (description && description.length > 500) {
      return res.status(400).json({ error: 'Description must be less than 500 characters' });
    }

    const todo = await Todo.findOne({ _id: id, user });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todo.title = title || todo.title;
    todo.description = description || todo.description;
    todo.status = status || todo.status;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    logger.error('[updateTodo] Error updating todo', error);
    res.status(500).json({ error: 'Error updating todo' });
  }
};

/**
 * Delete a TODO
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await Todo.findOneAndDelete({ _id: id });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.status(204).send();
  } catch (error) {
    logger.error('[deleteTodo] Error deleting todo', error);
    res.status(500).json({ error: 'Error deleting todo' });
  }
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
};
