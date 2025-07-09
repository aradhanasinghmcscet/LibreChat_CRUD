const express = require('express');
const router = express.Router();
const ExampleService = require('../services/ExampleService');
const { authenticate } = require('../middleware/auth');

// Initialize the service
const exampleService = new ExampleService();

// Create a new example - POST /api/examples
router.post('/', authenticate, async (req, res) => {
  try {
    const example = await exampleService.create(req.body);
    res.status(201).json(example);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all examples - GET /api/examples
router.get('/', authenticate, async (req, res) => {
  try {
    const { limit, skip } = req.query;
    const { items, count } = await exampleService.list({
      limit: parseInt(limit) || 10,
      skip: parseInt(skip) || 0
    });
    res.json({ items, count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single example - GET /api/examples/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const example = await exampleService.read(req.params.id);
    if (!example) {
      return res.status(404).json({ error: 'Example not found' });
    }
    res.json(example);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an example - PUT /api/examples/:id
router.put('/:id', authenticate, async (req, res) => {
  try {
    const example = await exampleService.update(req.params.id, req.body);
    if (!example) {
      return res.status(404).json({ error: 'Example not found' });
    }
    res.json(example);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an example - DELETE /api/examples/:id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const success = await exampleService.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Example not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Custom route to find examples by name - GET /api/examples/search
router.get('/search', authenticate, async (req, res) => {
  try {
    const { name } = req.query;
    const examples = await exampleService.findByName(name);
    res.json(examples);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
