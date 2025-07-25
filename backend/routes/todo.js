// backend/routes/todo.js
import express from 'express';
import { Todo } from '../models/Todo.js';

const router = express.Router();

// GET /api/todos
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /api/todos
router.post('/', async (req, res) => {
  const { text, dueDate } = req.body;
  try {
    const newTodo = await Todo.create({ text, dueDate, completed: false });
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add todo', details: err.message });
  }
});

// PUT /api/todos
// PUT /api/todos/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed, dueDate } = req.body;

    const todo = await Todo.findByPk(id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    // ✅ Safely update fields
    if (text !== undefined) todo.text = text;
    if (completed !== undefined) todo.completed = completed;
    if (dueDate !== undefined) todo.dueDate = dueDate;

    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update todo', details: err.message });
  }
});


// DELETE /api/todos/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findByPk(id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });

    await todo.destroy();
    res.json({ message: 'Todo deleted', id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export default router;
