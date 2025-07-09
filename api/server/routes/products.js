const express = require('express');
const router = express.Router();
const CRUDService = require('../services/CRUDService');
const Product = require('../models/Product');

// Initialize the service
const productService = new CRUDService(Product);

// Create a new product - POST /api/products
router.post('/', async (req, res) => {
  try {
    const product = await productService.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all products - GET /api/products
router.get('/', async (req, res) => {
  try {
    const { limit = 10, skip = 0, ...filter } = req.query;
    const products = await productService.list({
      limit: parseInt(limit) || 10,
      skip: parseInt(skip) || 0,
      filter: filter
    });
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a single product - GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await productService.read(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a product - PUT /api/products/:id
router.put('/:id', async (req, res) => {
  try {
    const product = await productService.update(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a product (soft delete) - DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  try {
    const product = await productService.update(req.params.id, { status: 'deleted' });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Search products - GET /api/products/search
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const products = await productService.search(query);
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
