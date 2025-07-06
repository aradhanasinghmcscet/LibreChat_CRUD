const express = require('express');
const { createTodo, getTodos, updateTodo, deleteTodo } = require('~/server/controllers/TodoController');

const router = express.Router();

// Routes
router.post('/', createTodo);
router.get('/', getTodos);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;
